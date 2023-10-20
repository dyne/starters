<script lang="ts">
	import type { ClientResponseErrorData } from '$lib/errorHandling';

	import type { ZodValidation } from 'sveltekit-superforms';

	import { getFormContext } from '../form.svelte';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { Select, MultiSelect } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';

	export let field: string;
	export let label = '';
	export let options: string[] = [];
	export let multiple = false;

	type T = $$Generic<AnyZodObject>;


	export let superform: SuperForm<ZodValidation<T>, ClientResponseErrorData>;

	const selectOptions: Array<SelectOptionType<string>> = options.map((o) => {
		return { value: o, name: o };
	});

	
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<FieldWrapper {field} {label}>
	{#if !multiple}
		<Select
			name={field}
			items={selectOptions}
			bind:value={$value}
			color={$errors ? 'red' : 'base'}
			data-invalid={$errors}
			{...$constraints}
		/>
	{:else}
		<MultiSelect
			name={field}
			items={selectOptions}
			bind:value={$value}
			data-invalid={$errors}
			dropdownClass="bg-white dark:bg-gray-800"
			{...$constraints}
		/>
	{/if}
</FieldWrapper>
