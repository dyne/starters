<script lang="ts" context="module">
	import type { PBResponseKeys } from '$lib/utils/types';

	export type InputMode = 'search' | 'select';

	export type RecordsManagerOptions<R extends PBRecord> = {
		inputMode: InputMode;
		multiple: boolean;
		name: string | undefined;
		placeholder: string | undefined;
		displayFields: PBResponseKeys<PBResponse<R>>[];
		excludeIds: string[];
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

	import { sineIn } from 'svelte/easing';
	import type { ComponentProps, SvelteComponent } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import IconButton from '../iconButton.svelte';
	import { Plus } from 'svelte-heros-v2';

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
		excludeIds = []
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
	$: exclude = [...excludeIds, ...tempIds];

	function setupTempIds(newValue: typeof value) {
		if (Array.isArray(newValue)) tempIds = newValue;
		else if (newValue) tempIds = [newValue];
	}

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

	// let record: PBResponse<RecordGeneric> | undefined = undefined;
	// $: if ($hideDrawer) record = undefined;

	// //

	// $: disabled = multiple && !!max && relation.length >= max;

	// function createModalStore(initialValue = false) {
	// 	const open = writable(initialValue);
	// 	function toggleDrawer() {
	// 		open.update((v) => !v);
	// 	}
	// 	return { ...open, toggleDrawer };
	// }

	// const hideDrawer = createModalStore(true);
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

<svelte:component
	this={inputComponent}
	{recordType}
	{collection}
	bind:recordId={tempId}
	options={{ name, placeholder, displayFields, excludeIds: exclude }}
/>

<ArrayOrItemManager bind:value let:item>
	{@const record = tempRecords[item]}
	{#if record}
		{createRecordLabel(record, displayFields)}
	{/if}
</ArrayOrItemManager>

<!--

{#if addButtonText}
	<div class="flex justify-end pt-4">
		<Button color="alternative" size="xs" on:click={toggleDrawer}>
			<Plus size="16" />
			<span class="ml-1">{addButtonText}</span>
		</Button>
	</div>
{/if}

<Drawer bind:hidden={$hideDrawer} {...drawerProps}>
	<div class="flex justify-between items-center">
		<Heading tag="h5">{addButtonText}</Heading>
		<div class="flex gap-2">
			<slot {record} name="actions" />
			<IconButton on:click={toggleDrawer}></IconButton>
		</div>
	</div>
	<slot {record} />
</Drawer> -->
