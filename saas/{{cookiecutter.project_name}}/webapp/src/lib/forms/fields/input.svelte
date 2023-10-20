<script lang="ts">
	import type { ClientResponseErrorData } from '$lib/errorHandling';

	import type { ZodValidation } from 'sveltekit-superforms';

	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { getFormContext } from '../form.svelte';
	import { Input } from 'flowbite-svelte';
	import type { InputType } from 'flowbite-svelte/dist/types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';
	type T = $$Generic<AnyZodObject>;


	export let superform: SuperForm<ZodValidation<T>, ClientResponseErrorData>;
	export let field: string;
	export let label = '';
	export let type: InputType = 'text';
	export let id = '';
	export let placeholder = '';

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<FieldWrapper {field} {label}>
	<Input
		{id}
		{type}
		color={$errors ? 'red' : 'base'}
		name={field}
		data-invalid={$errors}
		bind:value={$value}
		{...$constraints}
		{placeholder}
	/>
</FieldWrapper>
