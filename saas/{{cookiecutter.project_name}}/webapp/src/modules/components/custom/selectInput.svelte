<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts" module>
	export type Selected<T> = {
		label?: string;
		value: T;
		disabled?: boolean;
	};
</script>

<script lang="ts" generics="T, Multiple extends boolean = false">
	// TODO - FIX
	import { maybeArrayIsValue } from '@/utils/other';

	import { m } from '@/i18n';
	import { omit } from 'lodash/fp';

	import * as Select from '@/components/ui/select';
	import type { SelectRootProps } from 'bits-ui';
	import type { ControlAttrs } from 'formsnap';

	//

	type Props = SelectRootProps & {
		placeholder?: string;
		attrs?: ControlAttrs;
		items: Selected<T>;
	};
	let { value = $bindable(), items }: Props = $props();

	// export let selected: $$Props['selected'] = undefined;
</script>

<!-- Reference: https://formsnap.dev/docs/recipes/bits-ui-select -->
<!-- <Select.Root {...omit(['attrs', 'placeholder', 'label'], $$restProps)} bind:selected>
	{#if selected}
		{#if Array.isArray(selected)}
			{#each selected as item}
				<input name={props.attrs?.name} hidden value={item} />
			{/each}
		{:else}
			<input name={props.attrs?.name} hidden value={props.selected} />
		{/if}
	{/if}

	<Select.Trigger {...props.attrs}>
		<span data-placeholder>{props.placeholder ?? m.Select_a_value()}</span>
	</Select.Trigger>

	<Select.Content sideOffset={0} class="!mt-0">
		{#if props.items?.length}
			{#each props.items as { label, value }}
				<Select.Item {label} {value}>{label}</Select.Item>
			{/each}
		{:else}
			<Select.Item class="flex justify-center [&>span]:hidden" disabled value="">
				{m.No_options_available()}
			</Select.Item>
		{/if}
	</Select.Content>
</Select.Root> -->
