<script lang="ts" context="module">
	import type { InfoProps } from './types';
	import type { BaseRecord } from '$lib/utils/types';

	export type FormSelectOptions = InfoProps & {
		options?: string[];
		size?: 'sm' | 'lg' | 'md' | undefined;
		multiple?: boolean | undefined;
	};
</script>

<script lang="ts" generics="R extends BaseRecord">
	import { formFieldProxy, type FormPath, type SuperForm } from 'sveltekit-superforms/client';
	import { Select, MultiSelect } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import FieldWrapper from './fieldWrapper.svelte';

	//

	export let form: SuperForm<R>;
	export let field: FormPath<R>;
	export let options: FormSelectOptions = {};

	let { options: items = [], multiple = false, label = '' } = options;

	const { value, constraints } = formFieldProxy(form, field);

	const selectOptions: Array<SelectOptionType<string>> = items.map((i) => {
		return { value: i, name: i };
	});
</script>

<FieldWrapper {form} {field} {label} let:attrs>
	{#if !multiple}
		<Select items={selectOptions} bind:value={$value} {...options} {...$constraints} {...attrs} />
	{:else}
		<MultiSelect
			items={selectOptions}
			bind:value={$value}
			dropdownClass="bg-white dark:bg-gray-800"
			{...options}
			{...$constraints}
			{...attrs}
		/>
	{/if}
</FieldWrapper>
