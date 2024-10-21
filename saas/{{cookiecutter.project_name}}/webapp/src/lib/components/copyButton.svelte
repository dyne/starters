<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { ClipboardPlus } from 'lucide-svelte';
	import Icon from '@/components/custom/icon.svelte';
	import type { ComponentProps } from 'svelte';
	import { m } from '$lib/i18n';

	//

	type $$Props = ComponentProps<Button> & {
		delay?: number;
		iconSize?: number;
		textToCopy: string;
	};

	export let textToCopy: $$Props['textToCopy'];
	export let delay: $$Props['delay'] = 2000;
	export let iconSize: $$Props['iconSize'] = 20;

	let isCopied = false;

	function copyText() {
		navigator.clipboard.writeText(textToCopy);
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, delay);
	}
</script>

<Button variant="outline" on:click={copyText} color="alternative" {...$$restProps}>
	{#if !isCopied}
		<slot />
		<Icon src={ClipboardPlus} size={iconSize}></Icon>
	{:else}
		<span class="whitespace-nowrap">✅ {m.Copied()}</span>
	{/if}
</Button>
