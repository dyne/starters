<script lang="ts" context="module">
	import type { GenericRecord } from '@/utils/types';
</script>

<script lang="ts" generics="Data extends GenericRecord,T, Multiple extends boolean">
	import type { SuperForm } from 'sveltekit-superforms';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms/client';

	import * as Form from '@/components/ui/form';
	import FieldWrapper from './parts/fieldWrapper.svelte';
	import SelectInput, { type Selected } from '@/components/custom/selectInput.svelte';

	import type { FieldOptions } from './types';
	import type { ComponentProps } from 'svelte';
	import type { Writable } from 'svelte/store';

	//

	export let form: SuperForm<Data>;
	export let name: FormPath<Data, T | T[]>;
	export let options: Partial<FieldOptions> & ComponentProps<SelectInput<T, Multiple>>;

	//

	const value = fieldProxy(form, name) as Writable<T | T[]>;

	function getSelectedFromValue(value: T | T[]) {
		if (!options.items) throw new Error('missing_select_options');
		if (Array.isArray(value)) {
			return options.items.filter((option) => value.includes(option.value));
		} else {
			return options.items.find((option) => option.value == value);
		}
	}

	type ChangeFn = NonNullable<(typeof options)['onSelectedChange']>;

	const handleSelectedChange: ChangeFn = (data: Selected<T> | Selected<T>[] | undefined) => {
		if (!data) return;
		if (Array.isArray(data)) {
			$value = data.map((selected) => selected.value);
		} else {
			$value = data.value;
		}
	};
</script>

<Form.Field {form} {name}>
	<FieldWrapper
		field={name}
		options={{ label: options.label, description: options.description }}
		let:attrs
	>
		<!-- TODO - Fix typescript -->
		<!-- @ts-ignore -->
		<SelectInput
			{...options}
			{attrs}
			selected={getSelectedFromValue($value)}
			onSelectedChange={handleSelectedChange}
		/>
	</FieldWrapper>
</Form.Field>
