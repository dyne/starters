<script lang="ts" module>
	import type { NavigationTabProps as NavigationTab } from './navigationTab.svelte';
	export { type NavigationTab };
</script>

<script lang="ts">
	import NavigationTabComponent from './navigationTab.svelte';
	import { cn } from '@/components/utils';

	interface Props {
		tabs?: NavigationTab[];
		overflow?: 'wrap' | 'scroll';
	}

	let { tabs = [], overflow = 'scroll' }: Props = $props();

	let classes = $derived(
		cn('flex gap-1', {
			'overflow-x-auto': overflow == 'scroll',
			'flex-wrap': overflow == 'wrap'
		})
	);
</script>

<ul class={classes}>
	{#each tabs as tab}
		<li role="presentation">
			<NavigationTabComponent props={tab} />
		</li>
	{/each}
</ul>
