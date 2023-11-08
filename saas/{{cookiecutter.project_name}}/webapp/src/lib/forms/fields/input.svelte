<script lang="ts" context="module">
	import { Input } from 'flowbite-svelte';
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type FormInputOptions = Partial<HTMLInputAttributes & ComponentProps<Input>>;
</script>

<script lang="ts">
	import type { z } from 'zod';
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';

	type T = $$Generic<AnyZodObject>;

	export let superform: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let options: FormInputOptions = {};

	let type = options.type ?? 'text';
	let label = options['aria-label'];

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<FieldWrapper {field} {label}>
	<Input
		{...options}
		{type}
		color={$errors ? 'red' : 'base'}
		name={field}
		data-invalid={$errors}
		bind:value={$value}
		{...$constraints}
	/>
</FieldWrapper>
