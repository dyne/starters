<script lang="ts">
	import { capitalize } from 'effect/String';

	import * as Form from '@/components/ui/form';
	import type { FieldOptions } from '../types';
	import RequiredIndicator from '@/forms/components/requiredIndicator.svelte';

	interface Props {
		field: string;
		options?: Partial<FieldOptions>;
		children?: import('svelte').Snippet<[any]>;
	}

	let { field, options = {}, children }: Props = $props();
</script>

<Form.Control >
	{#snippet children({ attrs })}
		<Form.Label>
			{options.label ?? capitalize(field)}
			<RequiredIndicator {field} />
		</Form.Label>
		{@render children?.({ attrs, })}
	{/snippet}
</Form.Control>

{#if options.description}
	<Form.Description>{options.description}</Form.Description>
{/if}

<Form.FieldErrors />
