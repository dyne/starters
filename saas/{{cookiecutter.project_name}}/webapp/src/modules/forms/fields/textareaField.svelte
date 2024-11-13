<script module lang="ts">
	import type { GenericRecord } from '@/utils/types';
</script>

<script lang="ts" generics="Data extends GenericRecord">
	import * as Form from '@/components/ui/form';
	import { Textarea } from '@/components/ui/textarea';
	import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	import { stringProxy } from 'sveltekit-superforms';
	import type { ComponentProps } from 'svelte';
	import FieldWrapper from './parts/fieldWrapper.svelte';
	import type { FieldOptions } from './types';

	interface Props {
		form: SuperForm<Data>;
		name: FormPathLeaves<Data, string | number>;
		options?: Partial<FieldOptions> & ComponentProps<typeof Textarea>;
	}

	let { form, name, options = {} }: Props = $props();

	//

	let { form: formData } = form;

	const valueProxy = stringProxy(formData, name, { empty: 'undefined' });
</script>

<Form.Field {form} {name}>
	<FieldWrapper field={name} {options}>
		{#snippet children({ props })}
			<Textarea {...options} {...props} bind:value={$valueProxy} />
		{/snippet}
	</FieldWrapper>
</Form.Field>
