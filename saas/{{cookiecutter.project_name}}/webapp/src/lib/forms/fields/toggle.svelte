<script lang="ts">
	import type { ClientResponseErrorData } from '$lib/errorHandling';

	import type { ZodValidation } from 'sveltekit-superforms';

	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	import { Toggle, Label } from 'flowbite-svelte';
	import FieldError from './fieldParts/fieldError.svelte';
	import FieldRequiredIndicator from './fieldParts/fieldRequiredIndicator.svelte';
	
	type T = $$Generic<AnyZodObject>;


	export let superform: SuperForm<ZodValidation<T>, ClientResponseErrorData>;
	export let field: string;
	export let label = '';

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div class="space-y-2">
	<div class="flex items-center">
		<Toggle
			bind:checked={$value}
			name={field}
			value="true"
			data-invalid={$errors}
			{...$constraints}
		/>
		<Label color={$errors ? 'red' : 'gray'}>
			<div>
				<span><slot>{label}</slot></span>
				<FieldRequiredIndicator {field} />
			</div>
		</Label>
	</div>
	<FieldError {field} />
</div>
