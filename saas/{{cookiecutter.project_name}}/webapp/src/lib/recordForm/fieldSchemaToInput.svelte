<script lang="ts" context="module">
	import type { SvelteComponent, ComponentEvents, ComponentProps, ComponentType } from 'svelte';


	type FieldComponent = SvelteComponent<{
		field: string;
		superform: SuperForm<ZodValidation<AnyZodObject>, unknown>;
	}>;

	

	export function createFieldComponent<C extends FieldComponent>(
		component: ComponentType<C>,
		props?: ComponentProps<C>,
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
	import type { Writable } from 'svelte/store';
	import type { FormPathType } from 'sveltekit-superforms/dist/stringPath';
	import type { InputConstraint, UnwrapEffects, ZodValidation } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject } from 'zod';
	import { getFormContext } from '$lib/forms/form.svelte';

	//

	export let fieldSchema: FieldSchema;
	export let hidden = false;
	export let relationDisplayFields: RelationDisplayFields = [];
	export let relationInputMode: RelationInputMode = 'search';
	export let label = fieldSchema.name;
	export let component: FieldComponentProp = undefined;


	const field = fieldSchema.name;

	const multiple = isArrayField(fieldSchema);
	const { superform } = getFormContext()

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
	<Hidden {field} {superform} />
{:else if component}
	<svelte:component
		this={component.component}
		{field} 
		{superform}
		{...component.props}
		{...component.events}
		{label}
	/>
{:else if fieldSchema.type == FieldType.TEXT}
	<Input {field} {superform} {label} />
{:else if fieldSchema.type == FieldType.JSON}
	<Textarea {field} {superform} {label} />
{:else if fieldSchema.type == FieldType.BOOL}
	<Checkbox {field} {superform} >{label}</Checkbox>
{:else if fieldSchema.type == FieldType.FILE}
	<File {field} {superform} {label} {multiple} {accept} />
{:else if fieldSchema.type == FieldType.SELECT}
	<Select {field} {superform} {label} {options} {multiple} />
{:else if fieldSchema.type == FieldType.EDITOR}
	<Textarea {field} {superform} {label} />
{:else if fieldSchema.type == FieldType.RELATION}
	<Relations
		{field} {superform}
		{label}
		{multiple}
		collection={collectionId}
		displayFields={relationDisplayFields}
		inputMode={relationInputMode}
		{max}
	/>
{/if}
