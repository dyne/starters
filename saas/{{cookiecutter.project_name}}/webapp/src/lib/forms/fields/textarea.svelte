<script lang="ts" context="module">
	import { Textarea } from 'flowbite-svelte';
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type FormTextareaOptions = Partial<HTMLInputAttributes & ComponentProps<Textarea>>;
</script>

<script lang="ts">
	import type { z } from 'zod';
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';

	type T = $$Generic<AnyZodObject>;

	export let superform: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let options: FormTextareaOptions = {};

	let label = options['aria-label'];

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<FieldWrapper {field} {label}>
	<Textarea
		{...options}
		bind:value={$value}
		class={`!min-h-[200px] ${options.class}`}
		color={$errors ? 'red' : 'base'}
		name={field}
		data-invalid={$errors}
		{...$constraints}
	/>
</FieldWrapper>
