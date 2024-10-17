<script lang="ts">
	import * as Dialog from '@/components/ui/dialog/index.js';
	import { Footer } from '@/components/ui/dialog';
	import type { DialogProps } from 'bits-ui';
	import Separator from '@/components/ui/separator/separator.svelte';

	//

	type $$Props = DialogProps & {
		title?: string;
		description?: string;
		open: boolean;
		class?: string;
	};
	$: props = $$props as $$Props;

	export let open: $$Props['open'] = false;

	let className = '';
	export { className as class };
</script>

<Dialog.Root bind:open {...$$restProps}>
	<Dialog.Trigger />
	<Dialog.Content class={className}>
		{#if props.title || props.description}
			<Dialog.Header class="!text-left">
				{#if props.title}
					<Dialog.Title>{props.title}</Dialog.Title>
				{/if}
				{#if props.description}
					<Dialog.Description>
						{props.description}
					</Dialog.Description>
				{/if}
			</Dialog.Header>
		{/if}
		<Separator></Separator>

		<slot {Footer} />
	</Dialog.Content>
</Dialog.Root>
