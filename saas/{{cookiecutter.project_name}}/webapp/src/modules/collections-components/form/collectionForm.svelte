<script lang="ts" generics="C extends CollectionName">
	import type { SuperForm } from 'sveltekit-superforms';

	import { getCollectionModel } from '@/pocketbase/collections-models';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { KeyOf, MaybePromise } from '@/utils/types';
	import type { CollectionRecords, RecordIdString } from '@/pocketbase/types';
	import { Button } from '@/components/ui/button';
	import { m } from '$lib/i18n';
	import { c } from '$lib/utils/strings';
	import type { AnyFieldConfig } from '@/pocketbase/collections-models/types';
	import { Form, FormError, SubmitButton } from '@/forms';
	import { setupCollectionForm } from './collectionFormSetup';
	import FieldSchemaToInput from './fieldConfigToField.svelte';
	import {
		defaultFormOptions,
		type OnCollectionFormSuccess,
		type CollectionFormOptions,
		type FieldsOptions
	} from './formOptions';

	//

	export let collection: C;
	export let recordId: RecordIdString | undefined = undefined;
	export let initialData: Partial<CollectionRecords[C]> = {};

	export let onSuccess: OnCollectionFormSuccess<C> = () => {};
	export let onCancel: () => MaybePromise<void> = () => {};

	export let options: CollectionFormOptions<C> = defaultFormOptions<C>();

	/* */

	let form: SuperForm<CollectionRecords[C]>;
	$: form = setupCollectionForm<C>({
		collection,
		recordId,
		onSuccess,
		options,
		initialData
	});

	/* Sorting fields */

	let fieldsConfigs: AnyFieldConfig[] = getCollectionModel(collection)
		.schema.sort(createFieldConfigSorter(options.fields?.order))
		.filter(
			(config) => !options.fields?.exclude.includes(config.name as KeyOf<CollectionRecords[C]>)
		);

	function createFieldConfigSorter(order: string[] = []) {
		return (a: AnyFieldConfig, b: AnyFieldConfig) => {
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
		};
	}

	/* */

	let submitButtonText: string | undefined = undefined;
	$: submitButtonText = Boolean(options?.ui?.submitButtonText)
		? submitButtonText
		: Boolean(recordId)
			? m.Edit_record()
			: m.Create_record();

	/* ts helpers */

	function getFieldConfigName(fieldConfig: AnyFieldConfig) {
		return fieldConfig.name as KeyOf<CollectionRecords[C]>;
	}

	function getRelationsOptions(
		relationProp: FieldsOptions<C>['relations'],
		fieldName: KeyOf<CollectionRecords[C]>
	) {
		// @ts-expect-error Type mismatch but we don't care
		return relationProp?.[fieldName] ?? {};
	}
</script>

{#key initialData}
	<Form
		{form}
		hideRequiredIndicator={Boolean(options.ui?.hideRequiredIndicator)}
		hide={['submitButton', 'error']}
	>
		{#each fieldsConfigs as fieldSchema}
			{@const name = getFieldConfigName(fieldSchema)}
			{@const hidden = Object.keys(options.fields?.hide ?? {}).includes(name)}
			{@const label = c(options.fields?.labels?.[name] ?? name)}
			{@const component = options.fields?.components?.[name]}
			{@const collectionFieldOptions = getRelationsOptions(options.fields?.relations ?? {}, name)}
			{@const description = options.fields?.descriptions?.[name]}
			{@const placeholder = options.fields?.placeholders?.[name]}
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
			{#if options.ui?.showCancelButton}
				<Button variant="outline" on:click={onCancel}>{m.Cancel()}</Button>
			{/if}
			<SubmitButton>{submitButtonText}</SubmitButton>
		</div>
	</Form>
{/key}
