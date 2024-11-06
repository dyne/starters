<script lang="ts" module>
	import type { GenericRecord } from '@/utils/types';

	// Copied from `bits-ui`
	type WhenTrue<TrueOrFalse, IfTrue, IfFalse, IfNeither = IfTrue | IfFalse> = [
		TrueOrFalse
	] extends [true]
		? IfTrue
		: [TrueOrFalse] extends [false]
			? IfFalse
			: IfNeither;
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

	

	interface Props {
		//
		form: SuperForm<Data>;
		name: FormPath<Data>;
		options: Partial<FieldOptions> & ComponentProps<SelectInput<T, Multiple>>;
	}

	let { form, name, options }: Props = $props();

	//

	const value = fieldProxy(form, name) as Writable<T | T[]>;

	function getSelectedFromValue(
		value: T | T[]
	): WhenTrue<Multiple, Selected<T>[] | undefined, Selected<T> | undefined> {
		if (!options.items) throw new Error('missing_select_options');
		if (Array.isArray(value)) {
			// @ts-expect-error – Slight type mismatch
			return options.items.filter((option) => value.includes(option.value));
		} else {
			// @ts-expect-error – Slight type mismatch
			return options.items.find((option) => option.value == value);
		}
	}

	type OnSelectedChange = NonNullable<(typeof options)['onSelectedChange']>;

	const handleSelectedChange: OnSelectedChange = (
		data: Selected<T> | Selected<T>[] | undefined
	) => {
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
		
	>
		{#snippet children({ attrs })}
				<SelectInput
				items={options.items}
				multiple={options.multiple}
				{attrs}
				selected={getSelectedFromValue($value)}
				onSelectedChange={handleSelectedChange}
			/>
					{/snippet}
		</FieldWrapper>
</Form.Field>
