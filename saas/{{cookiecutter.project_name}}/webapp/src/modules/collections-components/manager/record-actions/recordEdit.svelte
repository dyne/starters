<script lang="ts" generics="C extends CollectionName">
	import Pencil from 'lucide-svelte/icons/pencil';
	import type { CollectionRecords, CollectionResponses } from '@/pocketbase/types';
	import { m } from '@/i18n';
	import type {
		OnCollectionFormSuccess,
		CollectionFormOptions
	} from '@/collections-components/form/collectionFormTypes';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import { createToggleStore } from '@/components/ui-custom/utils';
	import { getCollectionManagerContext } from '../collectionManagerContext';
	import { CollectionForm } from '@/collections-components';
	import Sheet from '@/components/ui-custom/sheet.svelte';
	import { merge } from 'lodash';
	import IconButton from '@/components/ui-custom/iconButton.svelte';
	import type { Snippet } from 'svelte';
	import type { GenericRecord } from '@/utils/types';
	import type { IconComponent } from '@/components/types';

	//

	interface Props {
		collection?: C | undefined;
		record: CollectionResponses[C];
		initialData?: Partial<CollectionRecords[C]>;
		sheetTitle?: string | undefined;
		onSuccess?: OnCollectionFormSuccess<C>;
		trigger?: Snippet<[{ open: () => void; props: GenericRecord; icon: IconComponent }]>;
	}

	let {
		record,
		initialData = {},
		sheetTitle = undefined,
		onSuccess = () => {},
		trigger: triggerSnippet
	}: Props = $props();

	//

	const show = createToggleStore(false);

	const { collection: c, formsOptions } = getCollectionManagerContext();
	const collectionName: C = c as C; // ts-fix

	const title = sheetTitle ?? m.Edit_record();

	const options: CollectionFormOptions<C> = merge({}, formsOptions.base, formsOptions.edit, {
		uiOptions: { submitButtonText: title, triggerToast: true }
	} as CollectionFormOptions<C>);

	const handleSuccess: OnCollectionFormSuccess<C> = (record) => {
		show.off();
		onSuccess(record, 'edit');
	};
</script>

<Sheet bind:open={$show} {title}>
	{#snippet trigger({ props })}
		{#if triggerSnippet}
			{@render triggerSnippet({ open: show.on, props, icon: Pencil })}
		{:else}
			<IconButton variant="outline" icon={Pencil} {...props} />
		{/if}
	{/snippet}

	{#snippet content()}
		<CollectionForm
			recordId={record.id}
			initialData={{ ...record, ...initialData }}
			collection={collectionName}
			{...options}
			onSuccess={handleSuccess}
		/>
	{/snippet}
</Sheet>
