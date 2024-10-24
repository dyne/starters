<script lang="ts" context="module">
	import type { CollectionFieldOptions } from '@/collections-management/collectionField.svelte';
	import type { FieldComponentProp } from './fieldConfigToField.svelte';

	import { Form, type FormOptions } from '@/forms';
	import type { MaybePromise } from '@/utils/types';

	//

	type Keys<T> = Extract<keyof T, string>;

	export type FieldsOptions<
		C extends CollectionName,
		Expand extends boolean,
		R = CollectionRecords[C]
	> = {
		labels: { [K in Keys<R>]?: string };
		descriptions: { [K in Keys<R>]?: string };
		placeholders: { [K in Keys<R>]?: string };
		order: Array<Keys<R>>;
		exclude: Array<Keys<R>>;
		hide: { [K in Keys<R>]?: R[K] };
		defaults: { [K in Keys<R>]?: R[K] };
		relations: {
			[K in Keys<R>]?: CollectionFieldOptions<C, Expand>;
		};
		components: { [K in Keys<R>]?: FieldComponentProp };
	};
</script>

<script lang="ts" generics="C extends CollectionName, Expand extends boolean">
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
	import type { AnyFieldConfig, CollectionName } from '@/pocketbase/collections-models/types';
	import { createCollectionZodSchema } from '@/pocketbase/zod-schema';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { createForm, FormError, SubmitButton } from '@/forms';
	import {
		cleanFormDataFiles,
		getFileFieldsInitialData,
		mockFileFieldsInitialData
	} from './collectionFormSetup';
	import FieldSchemaToInput from './fieldConfigToField.svelte';
	import { setError, type FormPathLeaves } from 'sveltekit-superforms';
	import { Record } from 'effect';

	//

	export let collection: C;
	export let initialData: Partial<CollectionRecords[C]> = {};
	export let recordId: RecordIdString | undefined = undefined;

	export let expand: Expand = false as Expand;

	export let fieldsOptions: Partial<FieldsOptions<C, Expand>> = {};
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

	export let submitButtonText = '';
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

	/* Schema filters */

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
		return !exclude.includes(config.name as Keys<CollectionRecords[C]>);
	}

	/* */

	$: submitButtonText = Boolean(submitButtonText)
		? submitButtonText
		: Boolean(recordId)
			? m.Edit_record()
			: m.Create_record();

	// Ts helper

	function getFieldConfigName(fieldConfig: AnyFieldConfig) {
		return fieldConfig.name as Keys<CollectionRecords[C]>;
	}
</script>

<Form {form} {hideRequiredIndicator} hide={['submitButton', 'error']}>
	{#each fieldsConfigs as fieldSchema}
		{@const name = getFieldConfigName(fieldSchema)}
		{@const hidden = hide ? Object.keys(hide).includes(name) : false}
		{@const label = c(labels?.[name] ?? name)}
		{@const component = components?.[name]}
		{@const collectionFieldOptions = relations?.[name] ?? {}}
		{@const description = descriptions?.[name]}
		{@const placeholder = placeholders?.[name]}
		<FieldSchemaToInput
			{description}
			{label}
			fieldConfig={fieldSchema}
			{hidden}
			{component}
			collectionFieldOptions={{
				...collectionFieldOptions,
				expand
			}}
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
