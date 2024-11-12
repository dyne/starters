<script lang="ts" module>
	import type {
		SelectRootProps,
		SelectMultipleRootPropsWithoutHTML,
		SelectSingleRootPropsWithoutHTML,
		SelectBaseRootPropsWithoutHTML
	} from 'bits-ui';
	import type { ArrayElement } from 'type-fest/source/internal';

	export type SelectItem = ArrayElement<SelectBaseRootPropsWithoutHTML['items']>;
	export type SelectType = SelectRootProps['type'];

	type TriggerSnippet<T> = Snippet<[{ value: T }]>;

	type Snippets<T> = {
		trigger?: TriggerSnippet<T>;
	};

	type SingleSelectProps = SelectBaseRootPropsWithoutHTML &
		SelectSingleRootPropsWithoutHTML &
		Snippets<string>;

	type MultipleSelectProps = SelectBaseRootPropsWithoutHTML &
		SelectMultipleRootPropsWithoutHTML &
		Snippets<string[]>;

	export type SelectProps = (SingleSelectProps | MultipleSelectProps) & {
		clearOnSelect?: boolean;
		placeholder?: string;
	};
</script>

<script lang="ts">
	import { ensureArray, maybeArrayIsValue } from '@/utils/other';

	import { m } from '@/i18n';
	import * as Select from '@/components/ui/select';
	import type { Snippet } from 'svelte';

	//

	let {
		value = $bindable(),
		items,
		trigger,
		onValueChange,
		clearOnSelect = false,
		placeholder,
		...rest
	}: SelectProps = $props();

	// TODO - Fix types
	// Line 57 - bind:value={value as undefined}
	// Line 76 - @render (trigger as TriggerSnippet<unknown>)
</script>

<Select.Root
	{...rest}
	bind:value={value as undefined}
	onValueChange={(v: string | string[]) => {
		// @ts-ignore
		onValueChange?.(v);
		if (clearOnSelect) value = undefined;
	}}
>
	<!-- Formsnap Fix -->
	<!-- Reference: https://formsnap.dev/docs/recipes/bits-ui-select -->
	{#if maybeArrayIsValue(value)}
		{#each ensureArray(value) as item}
			<input name={rest.name} hidden value={item} />
		{/each}
	{/if}
	<!-- Formsnap Fix -->

	<Select.Trigger>
		{#if maybeArrayIsValue(value)}
			{#if trigger}
				{@render (trigger as TriggerSnippet<unknown>)({ value })}
			{:else}
				{value}
			{/if}
		{:else}
			{placeholder ?? m.Select_a_value()}
		{/if}
	</Select.Trigger>

	<Select.Content>
		{#if items?.length}
			{#each items as item}
				<Select.Item value={item.value} disabled={item.disabled}>
					{item.label ?? item.value}
				</Select.Item>
			{/each}
		{:else}
			<Select.Item class="flex justify-center [&>span]:hidden" disabled value="">
				{m.No_options_available()}
			</Select.Item>
		{/if}
	</Select.Content>
</Select.Root>
