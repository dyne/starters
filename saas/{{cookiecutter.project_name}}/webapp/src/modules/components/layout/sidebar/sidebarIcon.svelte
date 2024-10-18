<script lang="ts">
	import Avatar from '@/components/custom/avatar.svelte';
	import type { BaseSidebarItemProps } from './types';
	import Icon from '@/components/custom/icon.svelte';
	import { String } from 'effect';

	export let props: BaseSidebarItemProps;
	let { icon, text } = props;
</script>

{#if typeof icon == 'string'}
	<div class="mr-2 flex size-4 items-center justify-center overflow-visible">
		<Avatar
			src={icon}
			fallback={text.slice(0, 2).toUpperCase()}
			class="size-5 rounded-sm [&>span]:rounded-sm"
		/>
	</div>
{:else if icon}
	<Icon src={icon} mr size={16}></Icon>
{/if}
