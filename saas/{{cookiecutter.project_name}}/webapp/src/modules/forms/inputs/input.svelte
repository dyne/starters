<script context="module" lang="ts">
	import type { GenericRecord } from '@/utils/types';
</script>

<script lang="ts" generics="Data extends GenericRecord">
	import type { ReadonlyRecord } from 'effect/Record';

	import type { Writable } from 'svelte/store';
	import { Record, pipe, Array, Option } from 'effect';
	import { capitalize } from '@/utils/other';
	import type { FieldOptions } from './types';

	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	import { numberProxy, stringProxy, fileProxy } from 'sveltekit-superforms';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export let form: SuperForm<Data>;
	export let field: FormPathLeaves<Data>;
	export let options: Partial<FieldOptions & HTMLInputAttributes> = {};

	//

	let { form: formData } = form;

	//

	const ValueProxies = {
		number: numberProxy(formData, field),
		text: stringProxy(formData, field, { empty: 'undefined' })
		// TODO: multiple files
	} satisfies Record<string, Writable<unknown>>;

	type ValueProxyType = keyof typeof ValueProxies;

	//

	type HTMLInputType = Exclude<HTMLInputAttributes['type'], undefined | null>;

	const ValueProxyToInputTypeMap: ReadonlyRecord<ValueProxyType, HTMLInputType[]> = {
		text: ['url', 'text', 'email'],
		number: ['number']
	};

	function getProxyType(inputType: HTMLInputType): ValueProxyType {
		return pipe(
			ValueProxyToInputTypeMap,
			Record.map((inputTypes) => inputTypes.includes(inputType)),
			Record.filter((b) => b),
			Record.toEntries,
			Array.head,
			Option.map(([proxyType]) => proxyType as ValueProxyType),
			Option.getOrElse(() => 'text' as ValueProxyType)
		);
	}

	let fieldType: ValueProxyType;
	$: fieldType = getProxyType(options.type ?? 'text');

	$: value = ValueProxies[fieldType];
</script>

<Form.Field {form} name={field}>
	{fieldType}
	<Form.Control let:attrs>
		<Form.Label>{options.label ?? capitalize(field)}</Form.Label>
		{#if value}
			<Input {...options} {...attrs} bind:value={$value} />
		{/if}
	</Form.Control>
	{#if options.description}
		<Form.Description>{options.description}</Form.Description>
	{/if}
	<Form.FieldErrors />
</Form.Field>
