<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts" context="module">
	import type { SvelteComponent, ComponentEvents, ComponentProps, ComponentType } from 'svelte';

	type FieldComponent = SvelteComponent<{
		field: string;
		superform: SuperForm<ZodValidation<AnyZodObject>, ClientResponseErrorData>;
	}>;

	export function createFieldComponent<C extends FieldComponent>(
		component: ComponentType<C>,
		props?: Omit<ComponentProps<C>, 'field' | 'superform'>,
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
	import { Checkbox, File, Hidden, Input, Relations, Select, Textarea } from '$lib/forms/fields';
	import { isArrayField } from '@/pocketbase/collections-models/utils';
	import type { AnyFieldConfig, FieldType } from '@/pocketbase/collections-models/types';
	import type { ZodValidation } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject } from 'zod';
	import { getFormContext } from '$lib/forms/form.svelte';
	import type { ClientResponseErrorData } from '$lib/errorHandling';
	import type { RecordsManagerOptions } from '$lib/components/records/recordsManager.svelte';
	import type { PBResponse } from '$lib/utils/types';

	//

	type R = $$Generic<PBResponse>;

	export let fieldSchema: AnyFieldConfig;
	export let component: FieldComponentProp = undefined;
	export let hidden = false;
	export let relationInputOptions: Partial<RecordsManagerOptions<R>> = {};
	export let label = fieldSchema.name;
	export let description: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;

	const field = fieldSchema.name;
	const multiple = isArrayField(fieldSchema);
	const { superform } = getFormContext();

	//

	/* Select */

	let options: string[] = [];
	if (fieldSchema.type == 'select') {
		options = [...fieldSchema.options.values];
	}

	/* File */

	let accept: string;
	if (fieldSchema.type == 'file') {
		accept = fieldSchema.options.mimeTypes.join(',');
	}

	/* Relation */

	let collectionId: string;
	let max: number;
	if (fieldSchema.type == 'relation') {
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
{:else if fieldSchema.type == 'text' || fieldSchema.type == 'url'}
	<Input {superform} {field} options={{ label, helpText: description, placeholder }} />
{:else if fieldSchema.type == 'number'}
	<Input
		{superform}
		{field}
		options={{ label, helpText: description, type: 'number', placeholder }}
	/>
{:else if fieldSchema.type == 'json'}
	<Textarea {superform} {field} options={{ label, helpText: description, placeholder }} />
{:else if fieldSchema.type == 'bool'}
	<Checkbox {superform} {field}>{label}</Checkbox>
{:else if fieldSchema.type == 'file'}
	<File {superform} {field} options={{ label, multiple, accept, placeholder }} />
{:else if fieldSchema.type == 'select'}
	<Select
		{superform}
		{field}
		options={{ label, options, multiple, helpText: description, placeholder }}
	/>
{:else if fieldSchema.type == 'editor'}
	<Textarea {superform} {field} options={{ label, helpText: description, placeholder }} />
{:else if fieldSchema.type == 'relation'}
	<Relations
		{superform}
		{field}
		collection={collectionId}
		options={{
			...relationInputOptions,
			label,
			multiple,
			max,
			helpText: description,
			placeholder
		}}
	/>
{/if}
