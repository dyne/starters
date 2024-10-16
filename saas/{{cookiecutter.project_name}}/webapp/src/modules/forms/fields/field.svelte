<script context="module" lang="ts">
	import type { GenericRecord } from '@/utils/types';
</script>

<script lang="ts" generics="Data extends GenericRecord">
	import FileField from '@/components/custom/fileManager.svelte';

	import type { ReadonlyRecord } from 'effect/Record';

	import type { Writable } from 'svelte/store';
	import { Record, pipe, Array, Option } from 'effect';
	import { capitalize } from '@/utils/other';
	import type { FieldOptions } from './types';

	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import type { FormPath, FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	import {
		numberProxy,
		stringProxy,
		fileProxy,
		filesProxy,
		fieldProxy
	} from 'sveltekit-superforms';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FieldWrapper from './parts/fieldWrapper.svelte';

	export let form: SuperForm<Data>;
	export let name: FormPathLeaves<Data> | FormPath<Data>;
	export let options: Partial<FieldOptions & HTMLInputAttributes> = {};

	//

	let { form: formData } = form;

	//

	const ValueProxies = {
		number: numberProxy(formData, name),
		text: stringProxy(formData, name, { empty: 'undefined' }),
		field: fieldProxy(formData, name)
		// files: filesProxy(formData, field)
		// TODO: multiple files
	} satisfies Record<string, Writable<unknown>>;

	type ValueProxyType = keyof typeof ValueProxies;

	//

	function getProxyType(attributes: HTMLInputAttributes): ValueProxyType {
		const { type, multiple } = attributes;
		if (type == 'text') return 'text';
		else if (type == 'number') return 'number';
		else if (type == 'file') return multiple ? 'files' : 'file';
		else return 'field';
	}

	let fieldType: ValueProxyType;
	$: valueProxy = ValueProxies[getProxyType(options)];
</script>

<Form.Field {form} {name}>
	<FieldWrapper field={name} {options} let:attrs>
		{#if valueProxy}
			{#if options.type == 'file'}
				<!-- <FileInput {...options} {...attrs} bind:files={$valueProxy} /> -->
			{:else}
				<Input {...options} {...attrs} bind:value={$valueProxy} />
			{/if}
		{/if}
	</FieldWrapper>
</Form.Field>
