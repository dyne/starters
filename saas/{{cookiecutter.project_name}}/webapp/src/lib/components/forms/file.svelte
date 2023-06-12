<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';

	import { Helper, Label } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';

	export let field: string;
	export let label = '';
	export let constraints = {};

	const { superform } = getFormContext();
	const { value, errors, constraints: formConstraints } = formFieldProxy(superform, field);

	let files: FileList | undefined;
	$: if (files) $value = [...files];
</script>

<div class="space-y-2">
	<Label color={$errors ? 'red' : 'gray'} for={field} class="mb-2">{label}</Label>
	<input
		name={field}
		data-invalid={$errors}
		type="file"
		bind:files
		{...$formConstraints}
		{...constraints}
	/>
	{#if $errors}
		<Helper class="mt-2" color="red">ds</Helper>
	{/if}
</div>
