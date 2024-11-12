<script lang="ts" generics="C extends CollectionName">
	import type { CollectionName, AnySchemaField } from '@/pocketbase/collections-models';
	import type { ExpandQueryOption } from '@/pocketbase/query';
	import { getFormContext } from '@/forms';
	import { CheckboxField, FileField, Field, SelectField, TextareaField } from '@/forms/fields';
	import CollectionField, { type CollectionFieldOptions } from '../collectionField.svelte';
	import { getCollectionNameFromId } from '@/pocketbase/collections-models';
	import { isArrayField } from '@/pocketbase/collections-models';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import type { GenericRecord } from '@/utils/types';
	import type { Snippet } from 'svelte';
	import type { FieldSnippet } from './formOptions';
	import type { CollectionRecords } from '@/pocketbase/types';

	//

	interface Props {
		fieldConfig: AnySchemaField;
		label?: any;
		description?: string | undefined;
		placeholder?: string | undefined;
		hidden?: boolean;
		collectionFieldOptions?: Omit<CollectionFieldOptions<C, ExpandQueryOption<C>>, 'collection'>;
		component?: FieldSnippet<CollectionRecords[C]>;
	}

	let {
		fieldConfig,
		label = fieldConfig.name as string,
		description = undefined,
		placeholder = undefined,
		hidden = false,
		collectionFieldOptions = {},
		component
	}: Props = $props();

	//

	const name = fieldConfig.name;
	const multiple = isArrayField(fieldConfig);
	const { form } = getFormContext();
</script>

{#if hidden}
	<!-- Nothing -->
{:else if component}
	{@render component({ form, field: name })}
{:else if fieldConfig.type == 'text' || fieldConfig.type == 'url' || fieldConfig.type == 'date' || fieldConfig.type == 'email'}
	<Field {form} {name} options={{ label, description, placeholder, type: fieldConfig.type }} />
{:else if fieldConfig.type == 'number'}
	<Field {form} {name} options={{ label, description, type: 'number', placeholder }} />
{:else if fieldConfig.type == 'json'}
	<TextareaField {form} {name} options={{ label, description, placeholder }} />
{:else if fieldConfig.type == 'bool'}
	<CheckboxField {form} {name} options={{ label, description }} />
{:else if fieldConfig.type == 'file'}
	{@const accept = fieldConfig.options.mimeTypes?.join(',')}
	<FileField {form} {name} options={{ label, multiple, accept, placeholder }} />
{:else if fieldConfig.type == 'select'}
	{@const items = fieldConfig.options.values?.map((v) => ({ label: v, value: v }))}
	<SelectField
		{form}
		{name}
		options={{ label, items, type: multiple ? 'multiple' : 'single', description, placeholder }}
	/>
{:else if fieldConfig.type == 'editor'}
	<TextareaField {form} {name} options={{ label, description, placeholder }} />
{:else if fieldConfig.type == 'relation'}
	{@const collectionName = getCollectionNameFromId(fieldConfig.options.collectionId!) as C}
	<CollectionField
		{form}
		{name}
		collection={collectionName}
		options={{
			...collectionFieldOptions,
			multiple,
			label,
			description
		}}
	/>
{/if}
