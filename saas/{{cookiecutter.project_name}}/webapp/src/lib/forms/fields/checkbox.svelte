<script lang="ts" context="module">
	import { Checkbox } from 'flowbite-svelte';
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type FormCheckboxOptions = Partial<HTMLInputAttributes & ComponentProps<Checkbox>>;
</script>

<script lang="ts">
	import type { z } from 'zod';
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	import { Label } from 'flowbite-svelte';
	import FieldError from './fieldParts/fieldError.svelte';
	import FieldRequiredIndicator from './fieldParts/fieldRequiredIndicator.svelte';

	type T = $$Generic<AnyZodObject>;

	export let superform: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let options: FormCheckboxOptions = {};

	let label = options['aria-label'];

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div class="space-y-2">
	<Label color={$errors ? 'red' : 'gray'}>
		<div class="flex items-center space-x-2">
			<Checkbox
				{...options}
				color={$errors ? 'red' : 'secondary'}
				bind:checked={$value}
				name={field}
				value="true"
				data-invalid={$errors}
				{...$constraints}
			/>
			<div>
				<span><slot>{label}</slot></span>
				<FieldRequiredIndicator {field} />
			</div>
		</div>
	</Label>
	<FieldError {field} />
</div>
