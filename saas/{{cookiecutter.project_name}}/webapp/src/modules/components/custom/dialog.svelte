<script lang="ts">
	import * as Dialog from '@/components/ui/dialog/index.js';
	import { Footer } from '@/components/ui/dialog';
	import type { DialogProps } from 'bits-ui';
	import Separator from '@/components/ui/separator/separator.svelte';
	import type { Snippet } from 'svelte';
	import type { Builder } from 'bits-ui';

	//

	type Props = DialogProps & {
		title?: string;
		description?: string;
		open?: boolean;
		class?: string;
		contentClass?: string;
		trigger?: Snippet<[{ builder: Builder; openDialog: () => void }]>;
		content?: Snippet<[{ Footer: typeof Footer; closeDialog: () => void }]>;
	};

	let {
		title,
		description,
		trigger,
		content,
		open = $bindable(false),
		class: className = '',
		contentClass = '',
		...rest
	}: Props = $props();

	function openDialog() {
		open = true;
	}

	function closeDialog() {
		open = false;
	}
</script>

<Dialog.Root bind:open {...rest} portal="body">
	<Dialog.Trigger asChild let:builder>
		{@render trigger?.({ builder, openDialog })}
	</Dialog.Trigger>

	<Dialog.Content class={contentClass}>
		{#if title || description}
			<Dialog.Header class="!text-left">
				{#if title}
					<Dialog.Title>{title}</Dialog.Title>
				{/if}
				{#if description}
					<Dialog.Description>
						{description}
					</Dialog.Description>
				{/if}
			</Dialog.Header>
			<Separator></Separator>
		{/if}

		{@render content?.({ Footer, closeDialog })}
	</Dialog.Content>
</Dialog.Root>
