<script context="module" lang="ts">
	import type { GenericRecord } from '@/utils/types';
</script>

<script lang="ts" generics="Data extends GenericRecord">
	import { capitalize } from '@/utils/other';

	import type { FieldOptions } from './types';

	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	import { fieldProxy } from 'sveltekit-superforms';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export let form: SuperForm<Data>;
	export let field: FormPathLeaves<Data>;
	export let options: Partial<FieldOptions & HTMLInputAttributes> = {};

	let { form: formData } = form;
	const proxy = fieldProxy(formData, field);
</script>

<Form.Field {form} name={field}>
	<Form.Control let:attrs>
		<Form.Label>{options.label ?? capitalize(field)}</Form.Label>
		<Input {...options} {...attrs} bind:value={$proxy} />
	</Form.Control>
	{#if options.description}
		<Form.Description>{options.description}</Form.Description>
	{/if}
	<Form.FieldErrors />
</Form.Field>
