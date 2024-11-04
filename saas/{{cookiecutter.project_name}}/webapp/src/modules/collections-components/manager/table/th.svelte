<script lang="ts" generics="T">
	import { DEFAULT_SORT_ORDER } from '@/pocketbase/query';
	import Icon from '@/components/custom/icon.svelte';
	import { Button } from '@/components/ui/button';
	import { getCollectionManagerContext } from '../collectionManagerContext';
	import { Head } from '@/components/ui/table';
	import type { KeyOf } from '@/utils/types';
	import { capitalize } from 'lodash';
	import { ArrowUp, ArrowDown } from 'lucide-svelte';

	export let field: KeyOf<T> | string;
	export let label: string | undefined = undefined;

	const { pocketbaseQuery } = getCollectionManagerContext();

	$: sortState = $pocketbaseQuery.sortOption;
	$: console.log(sortState);
	$: isSortField = sortState[0] == field;

	function handleClick() {
		// if (!isSortField) {
		// 	console.log('run');
		$pocketbaseQuery.options.sort = [field, DEFAULT_SORT_ORDER];
		// } else {
		// 	$pocketbaseQuery.flipSort();
		// }
	}
</script>

<Head class="group">
	<div class="flex items-center gap-x-2">
		{label ?? capitalize(field)}
		<pre>{isSortField}</pre>
		<Button
			size="icon"
			variant="ghost"
			class="{isSortField ? 'visible' : 'invisible'} size-6 group-hover:visible"
			on:click={handleClick}
		>
			x
			<!-- {#if !isSortField}
				<Icon src={ArrowUp} size={14} />
			{:else}
				<Icon src={sortState[1] == 'DESC' ? ArrowDown : ArrowUp} size={14} />
			{/if} -->
		</Button>
	</div>
</Head>
