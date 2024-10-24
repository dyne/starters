<script context="module" lang="ts">
	import type { GenericRecord } from '@/utils/types';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
</script>

<script
	lang="ts"
	generics="Data extends GenericRecord, C extends CollectionName, Expand extends boolean, Multiple extends boolean"
>
	import { m } from '$lib/i18n';

	import { ensureArray } from '@/utils/other';
	import ListItem from '@/components/custom/listItem.svelte';
	import { pb } from '@/pocketbase';
	import ArrayOrItemManager from '@/components/custom/arrayOrItemManager.svelte';
	import type { Writable } from 'svelte/store';
	import { CollectionSelect } from '.';
	import type { ExpandableResponse } from './types';
	import { createDefaultRecordPresenter, type RecordPresenter } from './utils';
	import type { RecordIdString } from '@/pocketbase/types';
	import * as Form from '@/components/ui/form';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import { fieldProxy } from 'sveltekit-superforms/client';
	import type { FieldOptions } from '@/forms/fields/types';
	import FieldWrapper from '@/forms/fields/parts/fieldWrapper.svelte';
	import CollectionSearch from './collectionSearch.svelte';
	import List from '@/components/custom/list.svelte';
	import T from '@/components/custom/t.svelte';

	//

	export let form: SuperForm<Data>;
	export let name: FormPath<Data>;
	export let options: Partial<FieldOptions> & {
		collection: C;
		expand?: Expand;
		filter?: string;
		exclude?: RecordIdString[];
		presenter?: RecordPresenter<ExpandableResponse<C, Expand>>;
		mode?: 'search' | 'select';
		multiple?: Multiple;
	};

	let {
		collection,
		mode = 'select',
		presenter = createDefaultRecordPresenter(collection),
		expand = false as Expand,
		multiple = false as Multiple,
		exclude = []
	} = options;

	//

	const valueProxy = fieldProxy(form, name) as Writable<string | string[] | undefined>;

	function fetchRecord(collection: C, id: string): Promise<ExpandableResponse<C, Expand>> {
		return pb.collection(collection).getOne(id, { requestKey: null });
	}

	function valueExists(value: typeof $valueProxy) {
		if (Array.isArray(value)) return Boolean(value.length);
		else return Boolean(value);
	}

	function addItem(proxy: typeof valueProxy, value: string, multiple: Multiple) {
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
	<FieldWrapper field={name} {options} let:attrs>
		{#if mode == 'search'}
			<CollectionSearch
				{collection}
				{expand}
				exclude={[...exclude, ...ensureArray($valueProxy)]}
				filter={options.filter}
				presenter={options.presenter}
				onSelect={(record) => {
					addItem(valueProxy, record.id, multiple);
				}}
			/>
		{:else if mode == 'select'}
			<CollectionSelect
				{collection}
				{expand}
				exclude={[...exclude, ...ensureArray($valueProxy)]}
				filter={options.filter}
				presenter={options.presenter}
				onSelect={(record) => {
					if (record) addItem(valueProxy, record.id, multiple);
				}}
				clearValueOnSelect
			/>
		{/if}

		<List class="min-h-[42px]">
			{#if valueExists($valueProxy)}
				<ArrayOrItemManager bind:data={$valueProxy} let:item let:removeItem>
					{#await fetchRecord(collection, item) then record}
						<ListItem on:click={removeItem}>
							{presenter(record)}
						</ListItem>
					{/await}
				</ArrayOrItemManager>
			{:else}
				<ListItem hideButton class="h-10 !justify-center">
					<T tag="small" class="text-primary/30">
						{m.No_items_selected()}
					</T>
				</ListItem>
			{/if}
		</List>
	</FieldWrapper>
</Form.Field>
