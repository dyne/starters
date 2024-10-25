<script lang="ts" generics="C extends CollectionName">
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { KeyOf, MaybePromise } from '@/utils/types';
	import { pipe } from 'effect/Function';
	import { ClientResponseError } from 'pocketbase';
	import { normalizeError } from '@/utils/other';
	import type { CollectionRecords, CollectionResponses, RecordIdString } from '@/pocketbase/types';
	import { Button } from '@/components/ui/button';
	import { zod } from 'sveltekit-superforms/adapters';
	import { m } from '$lib/i18n';
	import { c } from '$lib/utils/strings';
	import { pb } from '@/pocketbase';
	import { getCollectionModel } from '@/pocketbase/collections-models';
	import type { AnyFieldConfig } from '@/pocketbase/collections-models/types';
	import { createCollectionZodSchema } from '@/pocketbase/zod-schema';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { Form, createForm, FormError, SubmitButton, type FormOptions } from '@/forms';
	import {
		cleanFormDataFiles,
		getFileFieldsInitialData,
		mockFileFieldsInitialData
	} from './collectionFormSetup';
	import FieldSchemaToInput from './fieldConfigToField.svelte';
	import { setError, type FormPathLeaves } from 'sveltekit-superforms';
	import { Record } from 'effect';
	import type { FieldsOptions } from './fieldsOptions';

	//

	export let collection: C;
	export let initialData: Partial<CollectionRecords[C]> = {};
	export let recordId: RecordIdString | undefined = undefined;

	export let fieldsOptions: Partial<FieldsOptions<C>> = {};
	let {
		order = [],
		exclude = [],
		hide,
		labels,
		components,
		relations,
		placeholders,
		descriptions,
		defaults = {}
	} = fieldsOptions;

	export let formOptions: Partial<FormOptions<CollectionRecords[C]>> = {};

	export let submitButtonText: string | undefined = undefined;
	export let showCancelButton = false;
	export let hideRequiredIndicator = false;

	export let onSuccess: (record: CollectionResponses[C]) => MaybePromise<void> = () => {};
	export let onCreate: (record: CollectionResponses[C]) => MaybePromise<void> = () => {};
	export let onEdit: (record: CollectionResponses[C]) => MaybePromise<void> = () => {};
	export let onCancel: () => MaybePromise<void> = () => {};

	/* Schema generation */

	const collectionModel = getCollectionModel(collection);
	const fieldsConfigs = collectionModel.schema.sort(sortFieldsConfigs).filter(filterFieldsConfigs);
	const zodSchema = createCollectionZodSchema(collection).omit(
		// @ts-ignore
		// TODO - Improve type handling here
		Object.fromEntries(exclude.map((key) => [key, true]))
	);

	function sortFieldsConfigs(a: any, b: any) {
		const aIndex = order.indexOf(a.name);
		const bIndex = order.indexOf(b.name);
		if (aIndex === -1 && bIndex === -1) {
			return 0;
		}
		if (aIndex === -1) {
			return 1;
		}
		if (bIndex === -1) {
			return -1;
		}
		return aIndex - bIndex;
	}

	function filterFieldsConfigs(config: AnyFieldConfig) {
		return !exclude.includes(config.name as keyof CollectionRecords[C]);
	}

	/* Superform creation */

	let form: SuperForm<CollectionResponses[C]>;

	$: {
		let seededData = { ...defaults, ...initialData }; // "defaults" must be overwritten by "initialData"
		if (hide) seededData = { ...seededData, ...hide };

		const mockedData = mockFileFieldsInitialData(collectionModel, seededData);
		const fileFieldsInitialData = getFileFieldsInitialData(collectionModel, initialData);
		// TODO Fix- types
		// @ts-ignore
		form = createForm({
			// @ts-ignore
			adapter: zod(zodSchema),

			onSubmit: async ({ form }) => {
				try {
					const data = pipe(
						cleanFormDataFiles(form.data, fileFieldsInitialData),
						Record.map((v) => (v === undefined ? null : v)) // IMPORTANT!
					);
					let record: CollectionResponses[C];
					if (recordId) {
						record = await pb.collection(collection).update(recordId, data);
						onEdit(record);
					} else {
						record = await pb.collection(collection).create(data);
						onCreate(record);
					}
					onSuccess(record);
				} catch (e) {
					if (e instanceof ClientResponseError) {
						const details = e.data.data as Record<
							FormPathLeaves<CollectionRecords[C]>,
							{ message: string; code: string }
						>;
						Record.toEntries(details).forEach(([path, data]) => {
							if (path in form.data) setError(form, path, data.message);
							else setError(form, `${path} - ${data.message}`);
						});
						setError(form, e.message);
					} else {
						setError(form, normalizeError(e));
					}
				}
			},
			// @ts-ignore
			initialData: mockedData, // TODO : improve typings
			options: {
				dataType: 'form',
				...formOptions
			}
		});
	}

	/* */

	$: submitButtonText = Boolean(submitButtonText)
		? submitButtonText
		: Boolean(recordId)
			? m.Edit_record()
			: m.Create_record();

	// ts helpers

	function getFieldConfigName(fieldConfig: AnyFieldConfig) {
		return fieldConfig.name as KeyOf<CollectionRecords[C]>;
	}

	function getRelationsOptions(
		relationProp: typeof relations,
		fieldName: KeyOf<CollectionRecords[C]>
	) {
		// @ts-expect-error Type mismatch but we don't care
		return relationProp?.[fieldName] ?? {};
	}
</script>

<Form {form} {hideRequiredIndicator} hide={['submitButton', 'error']}>
	{#each fieldsConfigs as fieldSchema}
		{@const name = getFieldConfigName(fieldSchema)}
		{@const hidden = hide ? Object.keys(hide).includes(name) : false}
		{@const label = c(labels?.[name] ?? name)}
		{@const component = components?.[name]}
		{@const collectionFieldOptions = getRelationsOptions(relations, name)}
		{@const description = descriptions?.[name]}
		{@const placeholder = placeholders?.[name]}
		<FieldSchemaToInput
			{description}
			{label}
			fieldConfig={fieldSchema}
			{hidden}
			{component}
			{collectionFieldOptions}
			{placeholder}
		/>
	{/each}

	<slot {form} />

	<FormError />

	<div class="flex justify-end gap-2">
		{#if showCancelButton}
			<Button variant="outline" on:click={onCancel}>{m.Cancel()}</Button>
		{/if}
		<SubmitButton>{submitButtonText}</SubmitButton>
	</div>
</Form>
