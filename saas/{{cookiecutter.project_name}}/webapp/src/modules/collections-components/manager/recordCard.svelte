<script lang="ts" generics="C extends CollectionName">
	import { cn } from '@/components/utils';
	import type { CollectionResponses } from '@/pocketbase/types';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import ItemCard from '@/components/custom/itemCard.svelte';
	import { getCollectionManagerContext } from './collectionManagerContext';
	import {
		RecordSelect,
		type RecordAction,
		RecordEdit,
		RecordShare,
		RecordDelete
	} from './record-actions';

	


	interface Props {
		//
		record: CollectionResponses[C];
		hide?: Array<RecordAction>;
		class?: string;
		children?: import('svelte').Snippet<[any]>;
		right?: import('svelte').Snippet<[any]>;
	}

	let {
		record,
		hide = [],
		class: className = '',
		children,
		right
	}: Props = $props();
	

	//

	const { selectionContext: selection } = getCollectionManagerContext();
	const { selectedRecords } = selection;

	let classes = $derived(cn(className, {
		'border-primary': $selectedRecords.includes(record.id)
	}));

	const right_render = $derived(right);
</script>

<ItemCard class="{classes} "  >
	{#snippet left()}
	
			{#if !hide.includes('select')}
				<RecordSelect {record} />
			{/if}
		
	{/snippet}

	{#snippet children({ Title, Description })}
		{@render children?.({ Title, Description, })}

		{/snippet}
	{#snippet right()}
	
			{@render right_render?.({ record, })}

			{#if !hide.includes('edit')}
				<RecordEdit {record} />
			{/if}
			{#if !hide.includes('share')}
				<RecordShare {record} />
			{/if}
			{#if !hide.includes('delete')}
				<RecordDelete {record} />
			{/if}
		
	{/snippet}
</ItemCard>
