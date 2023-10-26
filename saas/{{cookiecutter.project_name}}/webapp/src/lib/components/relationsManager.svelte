<script lang="ts" context="module">
	export type InputMode = 'search' | 'select';
</script>

<script lang="ts">
	import { sineIn } from 'svelte/easing';
	import type { ComponentProps } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import IconButton from './iconButton.svelte';
	import { Plus } from 'svelte-heros-v2';
	import { Button, Drawer, Heading } from 'flowbite-svelte';
	import { pb } from '$lib/pocketbase';
	import type { PBRecord, PBResponse } from '$lib/utils/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import RecordSelect from './recordSelect.svelte';
	import RecordSearch from './recordSearch.svelte';
	import ArrayOrItemManager from './arrayOrItemManager.svelte';

	//

	export let relation: string[] | string;
	export let collection: string;
	export let displayFields: string[];
	export let multiple = false;
	export let name = '';
	export let max: number | undefined = undefined;
	export let mode: InputMode = 'search';
	export let addButtonText: string | undefined = undefined;

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	//

	let tempIDs: string[] = [];
	let tempRecords: Record<string, PBResponse<RecordGeneric>> = {};
	let item: string = '';

	let record: PBResponse<RecordGeneric> | undefined = undefined;

	$: if ($hideDrawer) record = undefined;

	$: {
		if (Array.isArray(relation)) tempIDs = relation;
		else if (relation) tempIDs = [relation];
		loadRecords();
	}

	async function loadRecords() {
		const data = await Promise.all(
			tempIDs.map((id) =>
				pb.collection(collection).getOne<PBResponse<RecordGeneric>>(id, { $autoCancel: false })
			)
		);
		data.forEach((d) => {
			tempRecords[d.id] = d;
		});
	}

	function buildRecordString(id: string) {
		return displayFields
			.map((f) => tempRecords[id][f])
			.filter((f) => Boolean(f))
			.join(' | ');
	}

	//

	$: disabled = multiple && !!max && relation.length >= max;

	function handleSelect(e: CustomEvent<{ record: PBResponse<PBRecord> }>) {
		const data = e.detail.record;
		if (multiple) relation = [...relation, data.id];
		else relation = data.id;
	}

	function createModalStore(initialValue = false) {
		const open = writable(initialValue);
		function toggleDrawer() {
			open.update((v) => !v);
		}
		return { ...open, toggleDrawer };
	}

	const hideDrawer = createModalStore(true);
	export const { toggleDrawer } = hideDrawer;

	//

	const drawerProps: ComponentProps<Drawer> = {
		transitionType: 'fly',
		backdrop: true,
		activateClickOutside: true,
		placement: 'right',
		transitionParams: {
			x: 320,
			duration: 200,
			easing: sineIn
		},
		class: '!p-6 !space-y-6',
		width: 'w-full md:w-4/5 lg:w-3/5'
	};
</script>

{#if mode == 'search'}
	<RecordSearch on:select={handleSelect} {collection} {name} {disabled} exclude={tempIDs} />
{:else}
	<RecordSelect on:select={handleSelect} {collection} {name} {displayFields} {disabled} />
{/if}
<ArrayOrItemManager
	bind:value={relation}
	on:show={(e) => {
		item = e.detail.item;
		toggleDrawer();
		record = tempRecords[item];
	}}
	let:item
>
	{@const record = tempRecords[item]}
	{#if record}
		{buildRecordString(record.id)}
	{/if}
</ArrayOrItemManager>
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
</Drawer>
