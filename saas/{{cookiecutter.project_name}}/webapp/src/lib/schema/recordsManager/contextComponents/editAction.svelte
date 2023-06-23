<script lang="ts" generics="T extends Record">
	import type { Record } from 'pocketbase';
	import { Button, Modal } from 'flowbite-svelte';
	import { Pencil } from 'svelte-heros-v2';
	import CrudForm, { formMode } from '$lib/schema/CRUDForm.svelte';
	import { getRecordsManagerContext } from '../recordsManager.svelte';

	export let record: T;

	const { loadRecords, formHiddenFields, formHiddenFieldsValues, formRelationsDisplayFields } =
		getRecordsManagerContext();

	let open = false;
</script>

<Button
	class="!p-2"
	color="alternative"
	on:click={() => {
		open = true;
	}}
>
	<Pencil size="20" />
</Button>

<Modal bind:open title="Edit record" size="lg">
	<div class="w-[500px]">
		<CrudForm
			mode={formMode.EDIT}
			collection={record.collectionId}
			initialData={record}
			relationsDisplayFields={formRelationsDisplayFields}
			hiddenFields={formHiddenFields}
			hiddenFieldsValues={formHiddenFieldsValues}
			on:success={() => {
				loadRecords();
				open = false;
			}}
		/>
	</div>
</Modal>
