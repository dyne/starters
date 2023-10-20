<script lang="ts">
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { getFormContext } from '../form.svelte';
	import type { ZodValidation } from 'sveltekit-superforms';
	import type { ClientResponseErrorData } from '$lib/errorHandling';

	type T = $$Generic<AnyZodObject>;


	export let field: string;
	export let superform: SuperForm<ZodValidation<T>, ClientResponseErrorData>;

	const { value } = formFieldProxy(superform, field);
</script>

<input type="hidden" id={field} name={field} bind:value={$value} />
