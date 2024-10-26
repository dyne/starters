<script lang="ts" generics="C extends CollectionName">
	import Pencil from 'lucide-svelte/icons/pencil';
	import Icon from '@/components/custom/icon.svelte';
	import type { CollectionRecords, CollectionResponses } from '@/pocketbase/types';
	import { m } from '@/i18n';
	import type {
		OnCollectionFormSuccess,
		CollectionFormOptions
	} from '@/collections-components/form/formOptions';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import { Button } from '@/components/ui/button';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import { getCollectionManagerContext } from '../collectionManagerContext';
	import { CollectionForm } from '@/collections-components';
	import Sheet from '@/components/custom/sheet.svelte';
	import { merge } from 'lodash';

	//

	export let collection: C | undefined = undefined;
	collection;

	export let record: CollectionResponses[C];
	export let initialData: Partial<CollectionRecords[C]> = {};

	export let sheetTitle: string | undefined = undefined;

	export let onSuccess: OnCollectionFormSuccess<C> = () => {};

	//

	const show = createToggleStore(false);

	const { collection: c, formsOptions } = getCollectionManagerContext();
	const collectionName: C = c as C; // ts-fix

	const title = sheetTitle ?? m.Edit_record();

	const options: CollectionFormOptions<C> = merge(formsOptions.base, formsOptions.edit, {
		ui: { submitButtonText: title, triggerToast: true }
	} as CollectionFormOptions<C>);

	const handleSuccess: OnCollectionFormSuccess<C> = (record) => {
		show.off();
		onSuccess(record, 'edit');
	};
</script>

<Sheet bind:open={$show} {title}>
	<svelte:fragment slot="trigger" let:builder>
		<slot name="trigger" {builder}>
			<Button builders={[builder]} size="icon" variant="outline">
				<slot>
					<Icon src={Pencil} />
				</slot>
			</Button>
		</slot>
	</svelte:fragment>

	<svelte:fragment slot="content">
		<CollectionForm
			recordId={record.id}
			initialData={{ ...record, ...initialData }}
			collection={collectionName}
			{...options}
			onSuccess={handleSuccess}
		/>
	</svelte:fragment>
</Sheet>
