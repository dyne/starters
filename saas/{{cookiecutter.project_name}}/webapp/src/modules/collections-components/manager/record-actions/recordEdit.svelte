<script lang="ts" generics="C extends CollectionName">
	import Pencil from 'lucide-svelte/icons/pencil';

	import Icon from '@/components/custom/icon.svelte';
	import type { CollectionRecords, CollectionResponses, RecordIdString } from '@/pocketbase/types';
	import { m } from '$lib/i18n';
	import {
		defaultFormOptions,
		type OnCollectionFormSuccess,
		type CollectionFormOptions
	} from '@/collections-components/form/formOptions';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import { Button } from '@/components/ui/button';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import { getRecordsManagerContext } from '../collectionManager.svelte';
	import { CollectionForm } from '@/collections-components';
	import { Plus } from 'lucide-svelte';
	import Sheet from '@/components/custom/sheet.svelte';
	import { merge } from 'lodash';

	//

	export let collection: C | undefined = undefined;
	collection;

	export let record: CollectionResponses[C];
	export let initialData: Partial<CollectionRecords[C]> = {};

	export let formOptions: CollectionFormOptions<C> = {};
	export let sheetTitle: string | undefined = undefined;

	export let onSuccess: OnCollectionFormSuccess<C> = () => {};

	//

	const show = createToggleStore(false);

	const { collection: c, formsOptions } = getRecordsManagerContext();
	const collectionName: C = c as C; // ts-fix

	const title = sheetTitle ?? m.Edit_record();

	const options = merge(
		formOptions,
		formsOptions.base,
		formsOptions.edit,
		defaultFormOptions<C>({
			ui: { submitButtonText: title, triggerToast: true }
		})
	);

	const handleSuccess: OnCollectionFormSuccess<C> = (record) => {
		show.off();
		onSuccess(record, 'edit');
	};
</script>

<Sheet bind:open={$show} {title}>
	<svelte:fragment slot="trigger" let:builder>
		<Button builders={[builder]} size="icon" variant="outline">
			<slot>
				<Icon src={Pencil} />
			</slot>
		</Button>
	</svelte:fragment>

	<svelte:fragment slot="content">
		<CollectionForm
			recordId={record.id}
			initialData={{ ...record, ...initialData }}
			collection={collectionName}
			{options}
			onSuccess={handleSuccess}
		/>
	</svelte:fragment>
</Sheet>
