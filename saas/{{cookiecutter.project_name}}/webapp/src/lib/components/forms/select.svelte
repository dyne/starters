<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';

	import { Helper, Label } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';

	export let field: string;
	export let label = '';
	export let options: string[] = [];

	const { superform } = getFormContext();
	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div class="space-y-2">
	<Label color={$errors ? 'red' : 'gray'} for={field} class="mb-2">{label}</Label>
	<select bind:value={$value} {...$constraints}>
		{#each options as option}
			<option value={option}>
				{option}
			</option>
		{/each}
	</select>
	{#if $errors}
		<Helper class="mt-2" color="red">{$errors}</Helper>
	{/if}
</div>
