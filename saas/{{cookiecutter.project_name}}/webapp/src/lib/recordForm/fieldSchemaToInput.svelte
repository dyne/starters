<script lang="ts" context="module">
	import type { SvelteComponent, ComponentEvents, ComponentProps, ComponentType } from 'svelte';

	type FieldComponent = SvelteComponent<{ field: string }>;

	export function createFieldComponent<C extends FieldComponent>(
		component: ComponentType<C>,
		props?: Omit<ComponentProps<C>, 'field'>,
		events?: ComponentEvents<C>
	) {
		return { component, props, events };
	}

	export type FieldComponentData<C extends FieldComponent = FieldComponent> = ReturnType<
		typeof createFieldComponent<C>
	>;
	export type FieldComponentProp<C extends FieldComponent = FieldComponent> =
		| FieldComponentData<C>
		| undefined;
</script>

<script lang="ts">
	import { createTypeProp } from '$lib/utils/typeProp';

	import type { FieldsSettings, RelationFieldSettings } from './recordForm.svelte';

	import type { InputMode as RelationInputMode } from '$lib/components/relationsManager.svelte';
	import {
		Checkbox,
		File,
		Hidden,
		Input,
		Relations,
		Select,
		Textarea,
		type RelationDisplayFields
	} from '$lib/forms/fields';
	import { isArrayField } from '$lib/pocketbase/schema';
	import { type FieldSchema, FieldType } from '$lib/pocketbase/schema/types';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let fieldSchema: FieldSchema;
	export let hidden = false;
	export let relationDisplayFields: RelationDisplayFields = [];
	export let extendedRelationDisplayFields: RelationDisplayFields = [];
	export let relationInputMode: RelationInputMode = 'search';
	export let label = fieldSchema.name;
	export let component: FieldComponentProp = undefined;
	export let showRelationCreateButton: boolean = true;
	export let showRelationEditButton: boolean = true;
	export let relationFormFieldsSettings:Partial<FieldsSettings<RecordGeneric>> = {}

	const field = fieldSchema.name;

	const multiple = isArrayField(fieldSchema);

	/* Select */

	let options: string[] = [];
	if (fieldSchema.type == FieldType.SELECT) {
		options = fieldSchema.options.values as string[];
	}

	/* File */

	let accept: string[];
	if (fieldSchema.type == FieldType.FILE) {
		accept = fieldSchema.options.mimeTypes as string[];
	}

	/* Relation */

	let collectionId: string;
	let max: number;
	if (fieldSchema.type == FieldType.RELATION) {
		collectionId = fieldSchema.options.collectionId as string;
		max = fieldSchema.options.maxSelect as number;
	}
</script>

{#if hidden}
	<Hidden {field} />
{:else if component}
	<svelte:component
		this={component.component}
		{field}
		{...component.props}
		{...component.events}
		{label}
	/>
{:else if fieldSchema.type == FieldType.TEXT}
	<Input {field} {label} />
{:else if fieldSchema.type == FieldType.JSON}
	<Textarea {field} {label} />
{:else if fieldSchema.type == FieldType.BOOL}
	<Checkbox {field}>{label}</Checkbox>
{:else if fieldSchema.type == FieldType.FILE}
	<File {field} {label} {multiple} {accept} />
{:else if fieldSchema.type == FieldType.SELECT}
	<Select {field} {label} {options} {multiple} />
{:else if fieldSchema.type == FieldType.EDITOR}
	<Textarea {field} {label} />
{:else if fieldSchema.type == FieldType.RELATION}
	<Relations
		{field}
		{label}
		{multiple}
		collection={collectionId}
		displayFields={relationDisplayFields}
		extendedDisplayFields={extendedRelationDisplayFields}
		inputMode={relationInputMode}
		showCreateButton={showRelationCreateButton}
		showEditButton={showRelationEditButton}
		formFieldsSettings={relationFormFieldsSettings}
		{max}
	/>
{/if}
