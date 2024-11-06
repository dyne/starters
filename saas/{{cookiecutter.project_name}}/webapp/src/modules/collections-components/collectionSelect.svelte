<script lang="ts" generics="C extends CollectionName, Expand extends ExpandQueryOption<C> = never">
	import { run } from 'svelte/legacy';

	import {
		type PocketbaseQueryOptions,
		type ExpandQueryOption,
		PocketbaseQuery,
		type QueryResponse
	} from '@/pocketbase/query';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import type { ControlAttrs } from 'formsnap';
	import { setupComponentPbSubscriptions } from '@/pocketbase';
	import type { CollectionRecords } from '@/pocketbase/types';
	import { createRecordDisplay, type RecordPresenter } from './utils';
	import SelectInput, { type Selected } from '@/components/custom/selectInput.svelte';

	//

	





	interface Props {
		// TODO - support two-way binding
		collection: C;
		queryOptions?: Partial<PocketbaseQueryOptions<C, Expand>>;
		disabled?: boolean;
		placeholder?: string | undefined;
		clearValueOnSelect?: boolean;
		onSelect?: (record: QueryResponse<C, Expand> | undefined) => void;
		displayFields?: (keyof CollectionRecords[C])[] | undefined;
		displayFn?: RecordPresenter<QueryResponse<C, Expand>> | undefined;
		attrs?: ControlAttrs | undefined;
	}

	let {
		collection,
		queryOptions = {},
		disabled = false,
		placeholder = undefined,
		clearValueOnSelect = false,
		onSelect = () => {},
		displayFields = undefined,
		displayFn = undefined,
		attrs = undefined
	}: Props = $props();


	let selectOptions: Selected<QueryResponse<C, Expand>>[] = $state([]);

	async function loadRecords(pocketbaseQuery: PocketbaseQuery<C, Expand>) {
		const records = await pocketbaseQuery.getFullList();
		selectOptions = records.map((item) => ({
			value: item,
			label: createRecordDisplay(item, displayFields, displayFn)
		}));
	}

	//

	const subscriptionCollections: CollectionName[] = [collection, 'authorizations'];
	for (const c of subscriptionCollections) {
		setupComponentPbSubscriptions(c, () => loadRecords(pocketbaseQuery));
	}

	//

	let selected: Selected<QueryResponse<C, Expand>> | undefined = $state(undefined);
	//

	let pocketbaseQuery = $derived(new PocketbaseQuery(collection, queryOptions));
	run(() => {
		loadRecords(pocketbaseQuery);
	});
	run(() => {
		onSelect(selected?.value);
		if (clearValueOnSelect) selected = undefined;
	});
</script>

<SelectInput {placeholder} {disabled} items={selectOptions} bind:selected {attrs} />
