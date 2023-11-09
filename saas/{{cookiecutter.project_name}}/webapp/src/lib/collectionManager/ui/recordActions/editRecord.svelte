<script lang="ts">
	import { createTypeProp } from '$lib/utils/typeProp';

	import type { PBRecord, PBResponse } from '$lib/utils/types';
	import { RecordForm, type FieldsSettings } from '$lib/recordForm';

	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import { Button, Modal } from 'flowbite-svelte';
	import { Pencil } from 'svelte-heros-v2';
	import { getRecordsManagerContext } from '../../collectionManager.svelte';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let record: PBResponse<RecordGeneric>;
	export let formSettings: Partial<FieldsSettings<RecordGeneric>> = {};

	//

	const { dataManager, formFieldsSettings } = getRecordsManagerContext<RecordGeneric>();
	const { base, edit } = formFieldsSettings;

	const fieldsSettings = {
		...base,
		...edit,
		...formSettings
	};

	//

	let open = false;

	function openModal() {
		open = true;
	}
	function closeModal() {
		open = false;
	}
</script>

<slot {openModal}>
	<Button class="!p-2" color="alternative" on:click={openModal}>
		<Pencil size="20" />
	</Button>
</slot>

<PortalWrapper>
	<Modal bind:open title="Edit record" size="md">
		<div class="w-full">
			<RecordForm
				collection={record.collectionId}
				recordId={record.id}
				initialData={record}
				{fieldsSettings}
				on:success={closeModal}
			/>
		</div>
	</Modal>
</PortalWrapper>
