<script lang="ts">
	import PortalWrapper from './portalWrapper.svelte';
	import { createToggleStore } from './utils/toggleStore';
	import type { ComponentProps } from 'svelte';
	import Dialog from '@/components/custom/dialog.svelte';

	// TODO - Fix and reuse

	export let title: string | undefined = undefined;
	export let modalProps: Partial<ComponentProps<Dialog>> = {};

	const show = createToggleStore(false);
</script>

<slot openModal={show.on} closeModal={show.off} />

<PortalWrapper>
	<Dialog {title} {...modalProps} bind:open={$show}>
		<slot name="modal" openModal={show.on} closeModal={show.off} />
	</Dialog>
</PortalWrapper>
