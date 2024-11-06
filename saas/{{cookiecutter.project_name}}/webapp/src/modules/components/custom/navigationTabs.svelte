<script lang="ts" module>
	import clsx from 'clsx';
	import type { NavigationTabProps as NavigationTab } from './navigationTab.svelte';
	export { type NavigationTab };
</script>

<script lang="ts">
	import NavigationTabComponent from './navigationTab.svelte';

	interface Props {
		tabs?: NavigationTab[];
		overflow?: 'wrap' | 'scroll';
	}

	let { tabs = [], overflow = 'scroll' }: Props = $props();

	let classes = $derived(clsx('flex gap-1', {
		'overflow-x-auto': overflow == 'scroll',
		'flex-wrap': overflow == 'wrap'
	}));
</script>

<ul class={classes}>
	{#each tabs as tab}
		<li role="presentation">
			<NavigationTabComponent props={tab} />
		</li>
	{/each}
</ul>
