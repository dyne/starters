<script lang="ts" context="module">
	export type RelationDisplayFields = string[];
</script>

<script lang="ts">
	import type { ClientResponseErrorData } from '$lib/errorHandling';

	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import type { z, AnyZodObject } from 'zod';


	import RelationsManager, {
		type InputMode as RelationInputMode
	} from '$lib/components/relationsManager.svelte';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { getFormContext } from '../form.svelte';
	import type { Collections } from '$lib/pocketbase/types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';

	export let field: FormPathLeaves<z.infer<T>>;
	export let superform: SuperForm<ZodValidation<T>, ClientResponseErrorData>;

	export let label = '';
	export let collection: string | Collections;
	export let multiple = false;
	export let displayFields: RelationDisplayFields = [];
	export let max: number | undefined = undefined;
	export let inputMode: RelationInputMode = 'search';

	type T = $$Generic<AnyZodObject>;

	const { validate } = superform;
	const { value } = formFieldProxy(superform, field);

	$: if (Array.isArray($value) && $value.length > 0) validateField($value as any);

	async function validateField(value: string) {
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
