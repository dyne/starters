<script lang="ts">
	import { capitalize } from 'effect/String';

	import * as Form from '@/components/ui/form';
	import type { FieldOptions } from '../types';
	import RequiredIndicator from '@/forms/components/requiredIndicator.svelte';
	import type { Snippet } from 'svelte';
	import type { ControlAttrs } from 'formsnap';

	interface Props {
		field: string;
		options?: Partial<FieldOptions>;
		children?: Snippet<[{ attrs: ControlAttrs }]>;
	}

	let { field, options = {}, children }: Props = $props();
</script>

<Form.Control let:attrs>
	<Form.Label>
		{options.label ?? capitalize(field)}
		<RequiredIndicator {field} />
	</Form.Label>

	{@render children?.({ attrs })}
</Form.Control>

{#if options.description}
	<Form.Description>{options.description}</Form.Description>
{/if}

<Form.FieldErrors />
