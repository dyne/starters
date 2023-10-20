<script lang="ts">
	import type { ClientResponseErrorData } from '$lib/errorHandling';

	import type { ZodValidation } from 'sveltekit-superforms';

	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { Textarea } from 'flowbite-svelte';
	import { getFormContext } from '../form.svelte';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';
	type T = $$Generic<AnyZodObject>;


	export let superform: SuperForm<ZodValidation<T>, ClientResponseErrorData>;
	export let field: string;
	export let label = '';
	export let placeholder = '';

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<FieldWrapper {field} {label}>
	<Textarea
		bind:value={$value}
		class="!min-h-[200px]"
		color={$errors ? 'red' : 'base'}
		name={field}
		data-invalid={$errors}
		{placeholder}
		{...$constraints}
	/>
</FieldWrapper>
