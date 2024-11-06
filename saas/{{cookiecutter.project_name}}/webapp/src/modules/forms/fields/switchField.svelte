<script lang="ts" module>
	import type { GenericRecord } from '@/utils/types';
</script>

<script lang="ts" generics="Data extends GenericRecord">
	import type { SuperForm } from 'sveltekit-superforms';
	import { fieldProxy, type FormPathLeaves } from 'sveltekit-superforms/client';

	import * as Form from '@/components/ui/form';
	import { Switch } from '@/components/ui/switch';

	import type { FieldOptions } from './types';
	import type { ComponentProps } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { capitalize } from 'effect/String';

	

	interface Props {
		//
		form: SuperForm<Data, any>;
		name: FormPathLeaves<Data, boolean>;
		options?: Partial<FieldOptions> & ComponentProps<Switch>;
	}

	let { form, name, options = {} }: Props = $props();

	//

	const value: Writable<boolean> = fieldProxy(form, name);
</script>

<Form.Field {form} {name}>
	<Form.Control >
		{#snippet children({ attrs })}
				<div class="flex items-center gap-2">
				<Switch {...attrs} includeInput bind:checked={$value} />
				<Form.Label>{options.label ?? capitalize(name)}</Form.Label>
			</div>
					{/snippet}
		</Form.Control>

	{#if options.description}
		<Form.Description>{options.description}</Form.Description>
	{/if}

	<Form.FieldErrors />
</Form.Field>
