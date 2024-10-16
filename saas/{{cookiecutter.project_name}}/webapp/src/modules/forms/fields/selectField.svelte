<script lang="ts" context="module">
	import type { GenericRecord } from '@/utils/types';

	export type SelectOption<T> = {
		label: string;
		value: T;
	};
</script>

<script lang="ts" generics="Data extends GenericRecord, T, Multiple extends boolean">
	import type { SuperForm } from 'sveltekit-superforms';
	import { fieldProxy, type FormPathLeaves } from 'sveltekit-superforms/client';

	import * as Form from '@/components/ui/form';
	import * as Select from '@/components/ui/select';

	import type { FieldOptions } from './types';
	import type { ComponentProps } from 'svelte';
	import type { Writable } from 'svelte/store';

	import FieldWrapper from './parts/fieldWrapper.svelte';
	import SelectInput from '@/components/custom/selectInput.svelte';

	//

	export let form: SuperForm<Data, any>;
	export let name: FormPathLeaves<Data, boolean>;
	export let options: Partial<FieldOptions> & ComponentProps<SelectInput<T, Multiple>>;

	//

	const value: Writable<boolean> = fieldProxy(form, name);
</script>

<Form.Field {form} {name}>
	<FieldWrapper
		field={name}
		options={{ label: options.label, description: options.description }}
		let:attrs
	>
		<SelectInput {...options} {attrs} />
	</FieldWrapper>
</Form.Field>
