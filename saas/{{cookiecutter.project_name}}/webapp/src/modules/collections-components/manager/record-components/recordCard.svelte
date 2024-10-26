<script lang="ts" generics="C extends CollectionName">
	import { cn } from '@/components/utils';
	import type { CollectionResponses } from '@/pocketbase/types';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import Card from '@/components/custom/card.svelte';
	import { getRecordsManagerContext } from '../collectionManager.svelte';
	import RecordCardTitle from './recordCardTitle.svelte';
	import RecordCardDescription from './recordCardDescription.svelte';
	import {
		RecordShare,
		RecordSelect,
		RecordEdit,
		RecordDelete,
		type ItemAction
	} from '../record-actions';

	//

	export let record: CollectionResponses[C];
	export let hide: Array<ItemAction> = [];

	//

	const { selectionContext: selection } = getRecordsManagerContext();
	const { selectedRecords } = selection;

	$: classes = cn({
		'border-primary': $selectedRecords.includes(record.id)
	});
</script>

<Card class={classes} contentClass="!p-4 flex justify-between gap-6">
	<div class="flex w-0 grow gap-4">
		{#if !hide.includes('select')}
			<RecordSelect {record} />
		{/if}
		<div>
			<slot Title={RecordCardTitle} Description={RecordCardDescription}></slot>
		</div>
	</div>

	<div class="">
		<slot name="right" {record} />
		{#if !hide.includes('edit')}
			<RecordEdit {record} />
		{/if}
		{#if !hide.includes('share')}
			<RecordShare {record} />
		{/if}
		{#if !hide.includes('delete')}
			<RecordDelete {record} />
		{/if}
	</div>
</Card>
