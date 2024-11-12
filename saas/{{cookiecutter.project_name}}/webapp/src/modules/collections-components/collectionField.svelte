<script module lang="ts">
	import type { GenericRecord } from '@/utils/types';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import type { ExpandQueryOption, QueryResponse } from '@/pocketbase/query';

	export type CollectionFieldOptions<
		C extends CollectionName,
		Expand extends ExpandQueryOption<C>
	> = {
		mode?: 'search' | 'select';
		multiple?: boolean;
	} & Omit<CollectionSelectBaseProps<C, Expand>, 'collection'> &
		Partial<FieldOptions>;
</script>

<script
	lang="ts"
	generics="Data extends GenericRecord, C extends CollectionName, Expand extends ExpandQueryOption<C> = never"
>
	import { m } from '@/i18n';
	import { ensureArray } from '@/utils/other';
	import ListItem from '@/components/custom/listItem.svelte';
	import { pb } from '@/pocketbase';
	import ArrayOrItemManager from '@/components/custom/arrayOrItemManager.svelte';
	import type { Writable } from 'svelte/store';
	import { CollectionSelect } from '.';
	import { createDefaultRecordPresenter, type RecordPresenter } from './utils';
	import * as Form from '@/components/ui/form';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import { fieldProxy } from 'sveltekit-superforms/client';
	import type { FieldOptions } from '@/forms/fields/types';
	import FieldWrapper from '@/forms/fields/parts/fieldWrapper.svelte';
	import CollectionSearch from './collectionSearch.svelte';
	import List from '@/components/custom/list.svelte';
	import T from '@/components/custom/t.svelte';
	import type { CollectionSelectBaseProps } from './types';

	//

	interface Props {
		form: SuperForm<Data>;
		name: FormPath<Data>;
		collection: C;
		options?: CollectionFieldOptions<C, Expand>;
	}

	const { form, name, collection, options = {} }: Props = $props();

	const { mode = 'select', displayFn, multiple = false } = $derived(options);

	const defaultPresenter = $derived(createDefaultRecordPresenter(collection));
	const presenter = $derived(displayFn ?? defaultPresenter);

	const queryOptions = $derived(options.queryOptions ?? {});
	const exclude = $derived(queryOptions.exclude ?? []);

	//

	const Component = $derived(mode == 'search' ? CollectionSearch : CollectionSelect);

	const valueProxy = fieldProxy(form, name) as Writable<string | string[] | undefined>;

	function fetchRecord(collection: C, id: string): Promise<QueryResponse<C, Expand>> {
		return pb.collection(collection).getOne(id, { requestKey: null });
	}

	function valueExists(value: typeof $valueProxy) {
		if (Array.isArray(value)) return Boolean(value.length);
		else return Boolean(value);
	}

	function addItem(proxy: typeof valueProxy, value: string, multiple: boolean) {
		proxy.update((v) => {
			if (multiple) {
				if (Array.isArray(v)) {
					if (v.includes(value)) return v;
					else return [...v, value];
				} else return [value];
			} else {
				return value;
			}
		});
	}
</script>

<Form.Field {form} {name}>
	<FieldWrapper field={name} {options}>
		{#snippet children({ props })}
			<Component
				{collection}
				queryOptions={{ ...queryOptions, exclude: [...exclude, ...ensureArray($valueProxy)] }}
				displayFn={presenter}
				displayFields={options.displayFields}
				onSelect={(record) => {
					addItem(valueProxy, record.id, multiple);
				}}
				clearValueOnSelect
				{...props}
			/>

			<List class="min-h-[42px]">
				{#if valueExists($valueProxy)}
					<ArrayOrItemManager bind:data={$valueProxy}>
						{#snippet children({ item, removeItem })}
							<ListItem onclick={removeItem}>
								{#await fetchRecord(collection, item) then record}
									{presenter(record)}
								{/await}
							</ListItem>
						{/snippet}
					</ArrayOrItemManager>
				{:else}
					<ListItem hideButton class="h-10 !justify-center">
						<T tag="small" class="text-secondary-foreground/30 font-normal">
							{m.No_items_selected()}
						</T>
					</ListItem>
				{/if}
			</List>
		{/snippet}
	</FieldWrapper>
</Form.Field>
