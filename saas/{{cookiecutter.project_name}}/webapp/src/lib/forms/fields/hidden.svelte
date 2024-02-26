<script lang="ts" context="module">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { BaseRecord } from '$lib/utils/types';

	export type FormHiddenOptions = Partial<HTMLInputAttributes>;
</script>

<script lang="ts" generics="R extends BaseRecord">
	import type { FormPath } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	export let form: SuperForm<R>;
	export let field: FormPath<R>;
	export let options: FormHiddenOptions = {};

	const { value } = formFieldProxy(form, field);
</script>

<input type="hidden" id={field} name={field} bind:value={$value} {...options} />
