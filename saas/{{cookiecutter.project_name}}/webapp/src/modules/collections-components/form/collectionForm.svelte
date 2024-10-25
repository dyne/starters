<script lang="ts" generics="C extends CollectionName">
	import { getCollectionModel } from '@/pocketbase/collections-models';

	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { KeyOf, MaybePromise } from '@/utils/types';
	import type { CollectionRecords, CollectionResponses, RecordIdString } from '@/pocketbase/types';
	import { Button } from '@/components/ui/button';
	import { zod } from 'sveltekit-superforms/adapters';
	import { m } from '$lib/i18n';
	import { c } from '$lib/utils/strings';
	import type { AnyFieldConfig } from '@/pocketbase/collections-models/types';
	import { Form, createForm, FormError, SubmitButton } from '@/forms';
	import { setupCollectionForm } from './collectionFormSetup';
	import FieldSchemaToInput from './fieldConfigToField.svelte';
	import {
		defaultFormOptions,
		type OnCollectionFormSuccess,
		type CollectionFormOptions
	} from './formOptions';
	import { merge } from 'lodash';
	import Spinner from '@/components/custom/spinner.svelte';

	//

	export let collection: C;
	export let recordId: RecordIdString | undefined = undefined;

	export let onSuccess: OnCollectionFormSuccess<C> = () => {};
	export let onCancel: () => MaybePromise<void> = () => {};

	export let options: CollectionFormOptions<C> = {};

	//

	let { fields, ui } = merge(defaultFormOptions<C>(), options);
	let { submitButtonText, hideRequiredIndicator, showCancelButton } = ui;

	let fieldsConfigs: AnyFieldConfig[] = getCollectionModel(collection).schema.sort();
	// let {
	// 	order,
	// 	components,

	// 	labels,
	// 	descriptions,
	// 	placeholders,
	// 	relations
	// } = fields;

	/* Schema generation */

	function createFieldConfigSorter(order: string[]) {
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

	/* Superform creation */

	/* */

	$: submitButtonText = Boolean(ui.submitButtonText)
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

{#await setupCollectionForm({ collection, recordId, onSuccess, options })}
	<div class="flex w-full justify-center p-4">
		<Spinner></Spinner>
	</div>
{:then form}
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
{/await}
