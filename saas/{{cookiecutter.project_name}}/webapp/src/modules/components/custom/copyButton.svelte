<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { ClipboardPlus } from 'lucide-svelte';
	import Icon from '@/components/custom/icon.svelte';
	import type { ComponentProps } from 'svelte';
	import { m } from '@/i18n';

	//

	type $$Props = ComponentProps<Button> & {
		delay?: number;
		textToCopy: string;
	};

	interface Props {
		textToCopy: $$Props['textToCopy'];
		delay?: $$Props['delay'];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { textToCopy, delay = 2000, children, ...rest }: Props = $props();

	let isCopied = $state(false);

	function copyText() {
		navigator.clipboard.writeText(textToCopy);
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, delay);
	}
</script>

<Button variant="outline" on:click={copyText} {...rest}>
	{#if !isCopied}
		{@render children?.()}
		<Icon src={ClipboardPlus} ml={Boolean(children)} />
	{:else}
		<span class="whitespace-nowrap">✅ {m.Copied()}</span>
	{/if}
</Button>
