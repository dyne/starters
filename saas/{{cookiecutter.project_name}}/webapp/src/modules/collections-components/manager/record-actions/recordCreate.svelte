<script lang="ts" generics="C extends CollectionName">
	import Icon from '@/components/ui-custom/icon.svelte';
	import type { CollectionRecords } from '@/pocketbase/types';
	import { m } from '@/i18n';
	import {
		type OnCollectionFormSuccess,
		type CollectionFormOptions
	} from '@/collections-components/form/formOptions';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import { Button } from '@/components/ui/button';
	import { createToggleStore } from '@/components/ui-custom/utils';
	import { getCollectionManagerContext } from '../collectionManagerContext';
	import { CollectionForm } from '@/collections-components';
	import { Plus } from 'lucide-svelte';
	import Sheet from '@/components/ui-custom/sheet.svelte';
	import { merge } from 'lodash';

	interface Props {
		//
		collection?: C | undefined;
		initialData?: Partial<CollectionRecords[C]> | undefined;
		sheetTitle?: string | undefined;
		onSuccess?: OnCollectionFormSuccess<C>;
		children?: import('svelte').Snippet;
	}

	let {
		collection = undefined,
		initialData = undefined,
		sheetTitle = undefined,
		onSuccess = () => {},
		children
	}: Props = $props();

	//

	const show = createToggleStore(false);

	const { collection: c, formsOptions } = getCollectionManagerContext();
	const collectionName: C = c as C; // ts-fix

	const title = sheetTitle ?? m.Create_record();

	const options: CollectionFormOptions<C> = merge({}, formsOptions.base, formsOptions.create, {
		uiOptions: { submitButtonText: title, triggerToast: true }
	} as CollectionFormOptions<C>);

	const handleSuccess: OnCollectionFormSuccess<C> = (record) => {
		show.off();
		onSuccess(record, 'create');
	};
</script>

<Sheet bind:open={$show} {title}>
	{#snippet trigger({ props })}
		<Button {...props} class="shrink-0">
			<Icon src={Plus} mr />
			{#if children}{@render children()}{:else}
				{title}
			{/if}
		</Button>
	{/snippet}

	{#snippet content()}
		<CollectionForm
			{initialData}
			collection={collectionName}
			{...options}
			onSuccess={handleSuccess}
		/>
	{/snippet}
</Sheet>
