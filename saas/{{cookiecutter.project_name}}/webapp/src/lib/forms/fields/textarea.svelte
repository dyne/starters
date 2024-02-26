<script lang="ts" context="module">
	import type { InfoProps } from './types';
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { BaseRecord } from '$lib/utils/types';
	import { Textarea } from 'flowbite-svelte';

	export type FormTextareaOptions = Partial<HTMLInputAttributes & ComponentProps<Textarea>> &
		InfoProps;
</script>

<script lang="ts" generics="R extends BaseRecord">
	import type { FormPath } from 'sveltekit-superforms';
	import { stringProxy, type SuperForm } from 'sveltekit-superforms/client';
	import FieldWrapper from './fieldWrapper.svelte';

	export let form: SuperForm<R>;
	export let field: FormPath<R>;
	export let options: FormTextareaOptions = {};

	const proxy = stringProxy(form, field, { empty: 'undefined' });
</script>

<FieldWrapper {form} {field} label={options.label} description={options.description} let:attrs>
	<Textarea bind:value={$proxy} class={`!min-h-[200px] ${options.class}`} {...options} {...attrs} />
</FieldWrapper>
