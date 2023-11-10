<script lang="ts" context="module">
	import type { LabelOption } from './types';

	export type RelationDisplayFields = string[];

	export type FormRelationsOptions = {
		multiple?: boolean;
		displayFields?: RelationDisplayFields;
		max?: number | undefined;
		inputMode?: RelationInputMode;
	} & LabelOption;
</script>

<script lang="ts">
	import type { z } from 'zod';
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	import RelationsManager, {
		type InputMode as RelationInputMode
	} from '$lib/components/relationsManager.svelte';
	import type { Collections } from '$lib/pocketbase/types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';

	type T = $$Generic<AnyZodObject>;

	export let superform: SuperForm<ZodValidation<T>, any>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let collection: string | Collections;
	export let options: FormRelationsOptions = {};

	let {
		multiple = false,
		displayFields = [],
		max = undefined,
		inputMode = 'search',
		label = ''
	} = options;

	const { validate } = superform;
	const { value } = formFieldProxy(superform, field as string);

	$: if (Array.isArray($value) && $value.length > 0) validateField($value);

	async function validateField(value: unknown) {
		await validate(field);
	}
</script>

<FieldWrapper {field} {label}>
	<RelationsManager
		name={field}
		bind:relation={$value}
		{collection}
		{multiple}
		{displayFields}
		{max}
		mode={inputMode}
	/>
</FieldWrapper>
