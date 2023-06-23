<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import DeleteAction from '$lib/schema/recordsManager/contextComponents/deleteAction.svelte';
	import EditAction from '$lib/schema/recordsManager/contextComponents/editAction.svelte';
	import SelectionCheckbox from '$lib/schema/recordsManager/contextComponents/selectionCheckbox.svelte';
	import RecordsManager from '$lib/schema/recordsManager/recordsManager.svelte';
	import { Button } from 'flowbite-svelte';

	export let data;
</script>

<div class="p-4">
	<RecordsManager
		collection={Collections.CrudExample}
		formRelationsDisplayFields={{
			relation_single: ['name', 'culo'],
			relation: ['name', 'culo']
		}}
		formHiddenFields={['owner']}
		formHiddenFieldsValues={{ owner: data.user?.id }}
		let:record
		let:isRecordSelected
	>
		<div>
			<div>{record.id}</div>
			<div>{record.text}</div>
			<div>{JSON.stringify(isRecordSelected)}</div>
			<div class="flex items-center space-x-2">
				<EditAction {record} />
				<DeleteAction {record} />
				<Button
					color="alternative"
					class="!py-2 !px-3"
					on:click={() => {
						console.log(record);
					}}>log</Button
				>
			</div>
			<SelectionCheckbox {record} />
		</div>
	</RecordsManager>
</div>
