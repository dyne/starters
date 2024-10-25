<script lang="ts">
	import Dialog from '@/components/custom/dialog.svelte';

	import { Button } from '@/components/ui/button';

	import { getCollectionNameFromId } from '@/pocketbase/collections-models';

	import { createTypeProp } from '$lib/utils/typeProp';

	import type { PBResponse } from '$lib/utils/types';
	import { CollectionForm, type CollectionFormOption } from '@/collections-components/form';

	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import { Pencil } from 'lucide-svelte';
	import { getRecordsManagerContext } from '../../collectionManager.svelte';

	//

	type RecordGeneric = $$Generic<PBResponse>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let record: RecordGeneric;
	export let formSettings: Partial<FieldsSettings<RecordGeneric>> = {};
	export let modalTitle = 'Edit record';

	//

	let { formFieldsSettings } = getRecordsManagerContext<RecordGeneric>();
	let { base, edit } = formFieldsSettings;

	let fieldsSettings = {
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
	<Button variant="outline" on:click={openModal}>
		<Pencil size="20" />
	</Button>
</slot>

<PortalWrapper>
	<Dialog bind:open title={modalTitle}>
		<div class="w-full">
			<slot name="beforeForm"></slot>
			<RecordForm
				collection={getCollectionNameFromId(record.collectionId)}
				recordId={record.id}
				initialData={record}
				{fieldsSettings}
				on:success={closeModal}
			/>
			<slot name="afterForm"></slot>
		</div>
	</Dialog>
</PortalWrapper>
