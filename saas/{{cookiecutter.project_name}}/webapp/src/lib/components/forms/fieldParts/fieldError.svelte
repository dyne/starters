<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from '../form.svelte';
	import { Helper } from 'flowbite-svelte';
	import { log } from '$lib/utils/devLog';

	export let field: string;

	const { superform } = getFormContext();
	const { errors } = formFieldProxy(superform, field);

	let errorsRecord: { key: string; errors: string[] }[] = [];

	// Sometimes validation errors are like {0: string[], 1: string[]}
	$: {
		if ($errors === undefined || $errors === null) errorsRecord = [];
		else if (Array.isArray($errors) && $errors.length > 0)
			errorsRecord = [{ key: field, errors: $errors }];
		else if (typeof $errors === 'object') {
			errorsRecord = [];
			Object.entries($errors).forEach(([key, errors]) => {
				if (Array.isArray(errors)) errorsRecord.push({ key, errors });
			});
		} else {
			log('unknown error shape', $errors);
		}
	}
</script>

{#if errorsRecord.length}
	<div class="space-y-1">
		{#each errorsRecord as record}
			<div>
				{#if errorsRecord.length != 1}
					<Helper color="red"><span class="font-bold">{record.key}</span></Helper>
				{/if}
				{#each record.errors as error}
					<Helper color="red">{error}</Helper>
				{/each}
			</div>
		{/each}
	</div>
{/if}
