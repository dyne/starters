<script lang="ts" generics="C extends CollectionName">
	import Icon from '@/components/custom/icon.svelte';
	import type { ComponentProps } from 'svelte';
	import Pencil from 'lucide-svelte/icons/pencil';
	import type { IconComponent } from '@/components/types';
	import type { CollectionRecords, CollectionResponses, RecordIdString } from '@/pocketbase/types';
	import { m } from '$lib/i18n';
	import {
		defaultFormOptions,
		type OnCollectionFormSuccess,
		type CollectionFormOptions,
		type CollectionFormMode
	} from '@/collections-components/form/formOptions';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import { Button } from '@/components/ui/button';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import { getRecordsManagerContext } from '../collectionManager.svelte';
	import { CollectionForm } from '@/collections-components';
	import { Plus } from 'lucide-svelte';
	import * as Sheet from '@/components/ui/sheet';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { toast } from 'svelte-sonner';
	import { merge } from 'lodash';

	//

	export let collection: C | undefined = undefined;
	collection;

	export let update: RecordIdString | undefined = undefined;
	export let initialData: Partial<CollectionRecords[C]> | undefined = undefined;

	export let formOptions: CollectionFormOptions<C> = {};
	export let formTitle: string | undefined = undefined;

	export let onSuccess: OnCollectionFormSuccess<C> = () => {};

	//

	const show = createToggleStore(false);

	const { collection: c, formsOptions } = getRecordsManagerContext();
	const collectionName: C = c as C; // ts-fix

	/* Definitions */

	type ComponentData = {
		icon: IconComponent;
		title: string;
		successMessage: string;
		showButtonText: boolean;
		formOptions: CollectionFormOptions<C>;
		buttonVariant: ButtonVariant;
	};

	type ButtonVariant = ComponentProps<Button>['variant'];

	let componentData: Record<CollectionFormMode, ComponentData>;
	$: componentData = {
		create: {
			icon: Plus,
			title: m.Create_record(),
			successMessage: m.Record_created_successfully(),
			showButtonText: true,
			formOptions: formsOptions.create,
			buttonVariant: 'default'
		},
		update: {
			icon: Pencil,
			title: m.Edit_record(),
			successMessage: m.Record_updated_successfully(),
			showButtonText: false,
			formOptions: formsOptions.edit,
			buttonVariant: 'outline'
		}
	};

	/* */

	let mode: CollectionFormMode;
	$: mode = Boolean(update) ? 'update' : 'create';

	$: title = formTitle ?? componentData[mode].title;

	$: options = merge(
		formOptions,
		formsOptions.base,
		componentData[mode].formOptions,
		defaultFormOptions<C>({
			ui: { submitButtonText: title },
			initialData
		})
	);

	const handleSuccess: OnCollectionFormSuccess<C> = (record, mode) => {
		show.off();
		toast.success(componentData[mode].successMessage);
		onSuccess(record, mode);
	};
</script>

<Sheet.Root bind:open={$show}>
	<Sheet.Trigger asChild let:builder>
		<slot name="button" openModal={show.on} {builder}>
			<Button builders={[builder]} class="shrink-0" variant="outline" on:click={show.on}>
				<Icon src={componentData[mode].icon} mr={componentData[mode].showButtonText} />
				<slot>
					{#if componentData[mode].showButtonText}
						{componentData[mode].title}
					{/if}
				</slot>
			</Button>
		</slot>
	</Sheet.Trigger>

	<Sheet.Content side="right" class="flex !min-w-[300px] !max-w-none flex-col px-0">
		<Sheet.Header class="px-6">
			<Sheet.Title>{title}</Sheet.Title>
			<Separator></Separator>
		</Sheet.Header>
		<div class="overflow-y-auto overflow-x-visible px-6">
			<slot name="form" closeModal={show.off}>
				<CollectionForm collection={collectionName} {options} onSuccess={handleSuccess} />
			</slot>
		</div>
	</Sheet.Content>
</Sheet.Root>
