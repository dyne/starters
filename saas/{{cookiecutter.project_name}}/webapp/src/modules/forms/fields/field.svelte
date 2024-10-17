<script context="module" lang="ts">
	import type { GenericRecord } from '@/utils/types';
</script>

<script lang="ts" generics="Data extends GenericRecord">
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	import { numberProxy, fieldProxy } from 'sveltekit-superforms';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FieldWrapper from './parts/fieldWrapper.svelte';
	import type { FieldOptions } from './types';

	export let form: SuperForm<Data>;
	export let name: FormPathLeaves<Data, string | number>;
	export let options: Partial<FieldOptions & HTMLInputAttributes> = {};

	//

	let { form: formData } = form;

	const numberValue = numberProxy(formData, name);
	const textValue = fieldProxy(formData, name);

	$: valueProxy = options.type == 'number' ? numberValue : textValue;
</script>

<Form.Field {form} {name}>
	<FieldWrapper field={name} {options} let:attrs>
		{#if valueProxy}
			<Input {...options} {...attrs} bind:value={$valueProxy} />
		{/if}
	</FieldWrapper>
</Form.Field>
