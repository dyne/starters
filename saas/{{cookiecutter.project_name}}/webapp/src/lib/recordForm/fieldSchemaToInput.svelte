<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts" context="module">
	import type { GenericRecord } from '@/utils/types';
	import type { SvelteComponent, ComponentEvents, ComponentProps, ComponentType } from 'svelte';

	type FieldComponent = SvelteComponent<{
		field: string;
		superform: SuperForm<GenericRecord, ClientResponseErrorData>;
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
	import type { Selected } from 'bits-ui';

	import { getFormContext } from '@/forms';
	import {
		CheckboxField,
		FileField,
		Field,
		RelationsField,
		SelectField,
		TextareaField
	} from '@/forms/fields';

	import { isArrayField } from '@/pocketbase/collections-models/utils';
	import type { AnyFieldConfig } from '@/pocketbase/collections-models/types';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject } from 'zod';
	import type { ClientResponseErrorData } from '$lib/errorHandling';
	import type { RecordsManagerOptions } from '$lib/components/records/recordsManager.svelte';
	import type { PBResponse } from '$lib/utils/types';

	//

	type R = $$Generic<PBResponse>;

	export let fieldSchema: AnyFieldConfig;
	export let component: FieldComponentProp = undefined;
	export let hidden = false;
	export let relationInputOptions: Partial<RecordsManagerOptions<R>> = {};
	export let label = fieldSchema.name as string;
	export let description: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;

	const name = fieldSchema.name;
	const multiple = isArrayField(fieldSchema);
	const { form } = getFormContext();

	//

	/* Select */

	let items: Selected<string>[] = [];
	if (fieldSchema.type == 'select') {
		items = fieldSchema.options.values.map((v) => ({ label: v, value: v }));
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
	<!-- Nothing -->
{:else if component}
	<svelte:component
		this={component.component}
		{name}
		{form}
		{...component.props}
		{...component.events}
		{label}
	/>
{:else if fieldSchema.type == 'text' || fieldSchema.type == 'url'}
	<Field {form} {name} options={{ label, description, placeholder }} />
{:else if fieldSchema.type == 'number'}
	<Field {form} {name} options={{ label, description, type: 'number', placeholder }} />
{:else if fieldSchema.type == 'json'}
	<TextareaField {form} {name} options={{ label, description, placeholder }} />
{:else if fieldSchema.type == 'bool'}
	<CheckboxField {form} {name}>{label}</CheckboxField>
{:else if fieldSchema.type == 'file'}
	<FileField {form} {name} options={{ label, multiple, accept, placeholder }} />
{:else if fieldSchema.type == 'select'}
	<SelectField {form} {name} options={{ label, items, multiple, description, placeholder }} />
{:else if fieldSchema.type == 'editor'}
	<TextareaField {form} {name} options={{ label, description, placeholder }} />
{:else if fieldSchema.type == 'relation'}
	<RelationsField
		{form}
		{name}
		options={{
			collection: collectionId
		}}
	/>
	<!-- <RelationsField
		{form}
		{name}
		collection={collectionId}
		options={{
			...relationInputOptions,
			label,
			multiple,
			max,
			helpText: description,
			placeholder
		}}
	/> -->
{/if}
