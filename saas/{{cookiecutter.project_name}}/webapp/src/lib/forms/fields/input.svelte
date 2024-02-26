<script lang="ts" context="module">
	import type { InfoProps } from './types';
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { BaseRecord } from '$lib/utils/types';
	import { Input } from 'flowbite-svelte';

	export type FormInputOptions = Partial<HTMLInputAttributes & ComponentProps<Input>> & InfoProps;
</script>

<script lang="ts" generics="R extends BaseRecord">
	import { stringProxy, type FormPath } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import FieldWrapper from './fieldWrapper.svelte';

	export let form: SuperForm<R>;
	export let field: FormPath<R>;
	export let options: FormInputOptions = {};

	let type = options.type ?? 'text';
	const proxy = stringProxy(form, field, { empty: 'undefined' });
</script>

<FieldWrapper {form} {field} label={options.label} description={options.description} let:attrs>
	<Input bind:value={$proxy} {type} {...options} {...attrs} />
</FieldWrapper>
