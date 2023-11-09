<script lang="ts" context="module">
	import type { PBResponseKeys } from '$lib/utils/types';

	export type InputMode = 'search' | 'select';

	export type RecordManagerActions = 'edit' | 'create';

	export type RecordsManagerOptions<R extends PBRecord> = {
		inputMode: InputMode;
		multiple: boolean;
		name: string | undefined;
		placeholder: string | undefined;
		displayFields: PBResponseKeys<PBResponse<R>>[];
		excludeIds: string[];
		hideActions: RecordManagerActions[];
		max: number | undefined;
	};
</script>

<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { PBRecord, PBResponse } from '$lib/utils/types';

	import RecordSelect from './recordSelect.svelte';
	import RecordSearch from './recordSearch.svelte';
	import ArrayOrItemManager from '$lib/components/arrayOrItemManager.svelte';

	import { createRecordLabel, filterStringArray } from './utils';
	import { createTypeProp } from '$lib/utils/typeProp';

	import Drawer from '$lib/components/drawer.svelte';
	import { Button } from 'flowbite-svelte';
	import { Plus } from 'svelte-heros-v2';
	import { createToggleStore } from '../utils/toggleStore';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let collection: string;
	export let value: string[] | string | undefined = undefined;

	export let options: Partial<RecordsManagerOptions<RecordGeneric>> = {};

	let {
		inputMode = 'search',
		multiple = false,
		name = undefined,
		placeholder = undefined,
		displayFields = [],
		excludeIds = [],
		hideActions = [],
		max = undefined
	} = options;

	// export let name = '';
	// export let max: number | undefined = undefined;
	// export let addButtonText: string | undefined = undefined;

	//

	let inputComponent: typeof RecordSearch<RecordGeneric> | typeof RecordSelect<RecordGeneric>;
	$: if (inputMode == 'search') inputComponent = RecordSearch;
	else if (inputMode == 'select') inputComponent = RecordSelect;

	//

	let tempId: string | undefined = undefined;
	$: handleSelect(tempId);

	function handleSelect(id: typeof tempId) {
		if (!id) return;

		if (!multiple) {
			value = id;
		} else {
			if (!value) value = [id];
			else {
				if (!value.includes(id)) {
					value = [...value, id];
				}
			}
		}

		tempId = undefined;
	}

	//

	let tempIds: string[] = [];
	$: setupTempIds(value);

	function setupTempIds(v: typeof value) {
		if (Array.isArray(v)) tempIds = v;
		else if (v) tempIds = [v];
	}

	//

	$: exclude = [...excludeIds, ...tempIds];
	$: disabled = isDisabled(value);

	function isDisabled(v: typeof value): boolean {
		if (!v || !Array.isArray(v) || !max) return false;
		return v.length >= max;
	}

	//

	let tempRecords: Record<string, PBResponse<RecordGeneric>> = {};
	$: loadRecords(tempIds);

	async function loadRecords(ids: typeof tempIds) {
		const records = await pb.collection(collection).getFullList<PBResponse<RecordGeneric>>({
			filter: filterStringArray('id', '=', '||', ids),
			requestKey: null
		});
		tempRecords = {};
		records.forEach((r) => {
			tempRecords[r.id] = r;
		});
	}

	//

	const hideCreateDrawer = createToggleStore(true);

	// let record: PBResponse<RecordGeneric> | undefined = undefined;
	// $: if ($hideDrawer) record = undefined;

	// //

	//

	// export const { toggleDrawer } = hideDrawer;

	// //

	// const drawerProps: ComponentProps<Drawer> = {
	// 	transitionType: 'fly',
	// 	backdrop: true,
	// 	activateClickOutside: true,
	// 	placement: 'right',
	// 	transitionParams: {
	// 		x: 320,
	// 		duration: 200,
	// 		easing: sineIn
	// 	},
	// 	class: '!p-6 !space-y-6',
	// 	width: 'w-full md:w-4/5 lg:w-3/5'
	// };
</script>

<div class="space-y-4">
	<svelte:component
		this={inputComponent}
		{recordType}
		{collection}
		bind:recordId={tempId}
		options={{ name, placeholder, displayFields, excludeIds: exclude, disabled }}
	/>

	<ArrayOrItemManager bind:value let:item>
		{@const record = tempRecords[item]}
		{#if record}
			{createRecordLabel(record, displayFields)}
		{/if}
	</ArrayOrItemManager>

	{#if !hideActions.includes('create')}
		<div class="flex justify-end">
			<Button color="alternative" size="xs" on:click={hideCreateDrawer.off}>
				<Plus size="16" />
				<span class="ml-1">{'sd'}</span>
			</Button>
		</div>
	{/if}
</div>

<Drawer bind:hidden={$hideCreateDrawer}>
	helo
	<!-- <div class="flex justify-between items-center">
		<Heading tag="h5">{addButtonText}</Heading>
		<div class="flex gap-2">
			<slot {record} name="actions" />
			<IconButton on:click={toggleDrawer}></IconButton>
		</div>
	</div>
	<slot {record} /> -->
</Drawer>