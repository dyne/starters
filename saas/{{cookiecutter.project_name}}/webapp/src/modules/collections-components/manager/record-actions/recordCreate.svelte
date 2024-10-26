<script lang="ts" generics="C extends CollectionName">
	import Icon from '@/components/custom/icon.svelte';
	import type { CollectionRecords } from '@/pocketbase/types';
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

	export let initialData: Partial<CollectionRecords[C]> | undefined = undefined;

	export let formOptions: CollectionFormOptions<C> = {};
	export let sheetTitle: string | undefined = undefined;

	export let onSuccess: OnCollectionFormSuccess<C> = () => {};

	//

	const show = createToggleStore(false);

	const { collection: c, formsOptions } = getRecordsManagerContext();
	const collectionName: C = c as C; // ts-fix

	const title = sheetTitle ?? m.Create_record();

	const options = merge(
		formOptions,
		formsOptions.base,
		formsOptions.create,
		defaultFormOptions<C>({
			ui: { submitButtonText: title, triggerToast: true }
		})
	);

	const handleSuccess: OnCollectionFormSuccess<C> = (record) => {
		show.off();
		onSuccess(record, 'create');
	};
</script>

<Sheet bind:open={$show} {title}>
	<svelte:fragment slot="trigger" let:builder>
		<Button builders={[builder]} class="shrink-0">
			<Icon src={Plus} mr />
			<slot>
				{title}
			</slot>
		</Button>
	</svelte:fragment>

	<svelte:fragment slot="content">
		<CollectionForm {initialData} collection={collectionName} {options} onSuccess={handleSuccess} />
	</svelte:fragment>
</Sheet>
