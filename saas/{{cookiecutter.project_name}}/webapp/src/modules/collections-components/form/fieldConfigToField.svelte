<script lang="ts" generics="C extends CollectionName">
	import type { CollectionName, AnySchemaField } from '@/pocketbase/collections-models';
	import type { ExpandQueryOption } from '@/pocketbase/query';
	import { getFormContext } from '@/forms';
	import { CheckboxField, FileField, Field, SelectField, TextareaField } from '@/forms/fields';
	import CollectionField, { type CollectionFieldOptions } from '../collectionField.svelte';
	import { getCollectionNameFromId } from '@/pocketbase/collections-models';
	import { isArrayField } from '@/pocketbase/collections-models';
	import type { Selected } from '@/components/custom/selectInput.svelte';
	import type { FieldComponentProp } from './fieldComponent';

	




	interface Props {
		//
		fieldConfig: AnySchemaField;
		label?: any;
		description?: string | undefined;
		placeholder?: string | undefined;
		hidden?: boolean;
		collectionFieldOptions?: Omit<
		CollectionFieldOptions<C, ExpandQueryOption<C>>,
		'collection'
	>;
		component?: FieldComponentProp | undefined;
	}

	let {
		fieldConfig,
		label = fieldConfig.name as string,
		description = undefined,
		placeholder = undefined,
		hidden = false,
		collectionFieldOptions = {},
		component = undefined
	}: Props = $props();

	//

	const name = fieldConfig.name;
	const multiple = isArrayField(fieldConfig);
	const { form } = getFormContext();

	/* Select */

	let items: Selected<string>[] = $state([]);
	if (fieldConfig.type == 'select' && fieldConfig.options.values) {
		items = fieldConfig.options.values.map((v) => ({ label: v, value: v }));
	}

	/* File */

	let accept: string = $state();
	if (fieldConfig.type == 'file' && fieldConfig.options.mimeTypes) {
		accept = fieldConfig.options.mimeTypes.join(',');
	}

	/* Relation */

	let collectionName: C = $state();
	if (fieldConfig.type == 'relation' && fieldConfig.options.collectionId) {
		const collectionId = fieldConfig.options.collectionId;
		collectionName = getCollectionNameFromId(collectionId) as C;
	}
</script>

{#if hidden}
	<!-- Nothing -->
{:else if component}
	<component.component
		{form}
		field={fieldConfig.name}
		{label}
		{...component.props}
		{...component.events}
	/>
{:else if fieldConfig.type == 'text' || fieldConfig.type == 'url' || fieldConfig.type == 'date' || fieldConfig.type == 'email'}
	<Field {form} {name} options={{ label, description, placeholder, type: fieldConfig.type }} />
{:else if fieldConfig.type == 'number'}
	<Field {form} {name} options={{ label, description, type: 'number', placeholder }} />
{:else if fieldConfig.type == 'json'}
	<TextareaField {form} {name} options={{ label, description, placeholder }} />
{:else if fieldConfig.type == 'bool'}
	<CheckboxField {form} {name} options={{ label, description }} />
{:else if fieldConfig.type == 'file'}
	<FileField {form} {name} options={{ label, multiple, accept, placeholder }} />
{:else if fieldConfig.type == 'select'}
	<SelectField {form} {name} options={{ label, items, multiple, description, placeholder }} />
{:else if fieldConfig.type == 'editor'}
	<TextareaField {form} {name} options={{ label, description, placeholder }} />
{:else if fieldConfig.type == 'relation'}
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
