<script lang="ts" context="module">
	import type { GenericRecord } from '@/utils/types';

	import type { PBResponse } from '$lib/utils/types';

	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { BaseSystemFields, CollectionRecords } from '@/pocketbase/types';

	export type RecordSearchOptions<R> = {
		searchFields: (keyof R)[];
		displayFields: (keyof R)[];
		exclude: string[];
	};
</script>

<script lang="ts" generics="C extends CollectionName, R extends CollectionRecords[C]">
	import { removeTrailingSlash } from '@/utils/other';

	import Search from '@/components/custom/search.svelte';
	import Svelecte from 'svelecte';

	import type { RecordFullListOptions } from 'pocketbase';
	import { pb } from '@/pocketbase';
	import type { RecordInputOptions } from './types';
	import { createRecordLabel, searchTextFilter, excludeIdsFilter, mergeFilters } from './utils';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	import type { SearchFunction, SearchResult } from '@/components/custom/search.svelte';

	//

	export let collection: C;
	export let recordId: string | undefined = undefined;
	export let options: Partial<RecordSearchOptions<R>> = {};

	// let {
	// 	displayFields = [],
	// 	name = undefined,
	// 	required = false,
	// 	placeholder = undefined,
	// 	filter = undefined,
	// 	expand = undefined,
	// 	formatRecord = undefined
	// } = options;

	// $: exclude = options.excludeIds ?? [];
	// $: disabled = options.disabled ?? false;

	//

	const valueField = 'value';
	const labelField = 'label';

	type Option = {
		[valueField]: string;
		[labelField]: string;
	};

	function handleChange(e: CustomEvent<null | Option>) {
		recordId = e.detail?.[valueField];
	}

	//

	// async function fetchOptions(text: string | undefined): Promise<Option[]> {
	// 	// const pbFilter = mergeFilters(
	// 	// 	text ? searchTextFilter(collection, text) : undefined,
	// 	// 	excludeIdsFilter(exclude),
	// 	// 	filter
	// 	// );
	// 	// const options: RecordFullListOptions = {
	// 	// 	requestKey: null
	// 	// };
	// 	// if (expand) options.expand = expand;
	// 	// if (pbFilter) options.filter = pbFilter;
	// 	// const records = await pb.collection(collection).getFullList<RecordGeneric>(options);
	// 	// return records.map((r) => {
	// 	// 	return {
	// 	// 		[valueField]: r.id,
	// 	// 		label: formatRecord ? formatRecord(r) : createRecordLabel(r, displayFields)
	// 	// 	};
	// 	// });
	// }

	//

	// let record: RecordGeneric | undefined = undefined;
	// $: loadRecord(recordId);

	// let actualPlaceholder: string | undefined = placeholder;
	// $: setPlaceholder(record);

	// async function loadRecord(value: string | undefined) {
	// 	if (value) record = await pb.collection(collection).getOne(value);
	// 	else record = undefined;
	// }

	// function setPlaceholder(maybeRecord: typeof record) {
	// 	if (maybeRecord)
	// 		actualPlaceholder = formatRecord
	// 			? formatRecord(maybeRecord)
	// 			: createRecordLabel(maybeRecord, displayFields);
	// 	else actualPlaceholder = placeholder;
	// }

	//

	// let fetchData: Awaited<ReturnType<typeof getSearchUrlAndHeaders>> | undefined = undefined;
	// $: getSearchUrlAndHeaders(collection, undefined).then((res) => (fetchData = res));

	// async function getSearchUrlAndHeaders(
	// 	collection: CollectionName,
	// 	filter: string | undefined = undefined
	// ) {
	// 	let url: string;
	// 	let headers: HeadersInit;

	// 	const options: RecordFullListOptions = {
	// 		fetch: async (requestUrl, requestConfig) => {
	// 			url = requestUrl.toString();
	// 			headers = requestConfig?.headers!;
	// 			return new Response();
	// 		}
	// 	};
	// 	if (filter) options.filter = filter;

	// 	await pb.collection(collection).getFullList(options);

	// 	// @ts-expect-error Variables used before being assigned
	// 	if (!url || !headers) throw new Error('no url or headers');
	// 	return { url, headers };
	// }

	function createSearchFunction(collection: CollectionName): SearchFunction<R> {
		return async (text: string) => {
			console.log(text);
			const records = await pb.collection(collection).getFullList<R & BaseSystemFields>({
				requestKey: null
			});
			return records.map((item) => ({
				value: item,
				label: item.id
			}));
		};
	}
</script>

<!-- 
<pre>{fetchData?.headers}</pre>
<pre>{fetchData?.url}</pre>

<Svelecte fetch={fetchData?.url} fetchProps={fetchData?.headers}>
	<svelte:fragment slot="option" let:item>
		<pre>{JSON.stringify(item)}</pre>
	</svelte:fragment>
</Svelecte> -->

<div class="p-20"></div>

<Search
	searchFunction={createSearchFunction(collection)}
	selectFunction={(item) => {
		console.log(item);
	}}
/>

<!-- TODO - fix with shadcn -->
<!-- <Svelecte
	{name}
	{valueField}
	{labelField}
	placeholder={actualPlaceholder}
	fetch={fetchOptions}
	value={recordId}
	on:change={handleChange}
	{disabled}
	{required}
/> -->
