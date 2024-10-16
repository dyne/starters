<script lang="ts" context="module">
	export type Selected<T> = {
		label?: string;
		value: T;
	};
</script>

<script lang="ts" generics="T, Multiple extends boolean = false">
	import { m } from '$lib/i18n';

	import * as Select from '@/components/ui/select';
	import type { SelectProps } from 'bits-ui';
	import type { ControlAttrs } from 'formsnap';

	//

	type $$Props = SelectProps<T, Multiple> & { placeholder?: string; attrs?: ControlAttrs };
	$: props = $$props as $$Props;
</script>

<Select.Root {...$$restProps}>
	<!-- Reference: https://formsnap.dev/docs/recipes/bits-ui-select -->
	{#if props.selected}
		{#if Array.isArray(props.selected)}
			{#each props.selected as item}
				<input name={props.attrs?.name} hidden value={item} />
			{/each}
			<input name={props.attrs?.name} hidden value={props.selected} />
		{/if}
	{/if}

	<Select.Trigger {...props.attrs}>
		<Select.Value placeholder={props.placeholder ?? m.Select_a_value()} />
	</Select.Trigger>

	<Select.Content>
		{#if props.items}
			{#each props.items as { label, value }}
				<Select.Item {label} {value}>{label}</Select.Item>
			{/each}
		{/if}
	</Select.Content>
</Select.Root>
