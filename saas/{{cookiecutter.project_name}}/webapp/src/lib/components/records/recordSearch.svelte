<script lang="ts">
	import type { RecordInputOptions } from './types';

	import { pb } from '$lib/pocketbase';
	import type { PBRecord, PBResponse, PBResponseKeys } from '$lib/utils/types';
	import type { Collections } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { createRecordLabel, excludeStringArray, getCollectionFieldNames } from './utils';
	// @ts-ignore
	import Svelecte from 'svelecte';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	//

	export let collection: string | Collections;
	export let value: string | undefined = undefined;
	export let options: Partial<RecordInputOptions<RecordGeneric>> = {};

	let {
		displayFields = [],
		disabled = false,
		name = undefined,
		excludeIds = [],
		required = false,
		placeholder = undefined
	} = options;

	//

	const valueField = 'value';
	const labelField = 'label';

	type Option = {
		[valueField]: string;
		[labelField]: string;
	};

	function handleChange(e: CustomEvent<null | Option>) {
		value = e.detail?.[valueField];
	}

	//

	async function fetchOptions(text: string | undefined): Promise<Option[]> {
		if (!text) return [];

		const records = await pb.collection(collection).getFullList<PBResponse<RecordGeneric>>({
			requestKey: null,
			filter: filterString(text)
		});

		return records.map((r) => {
			return {
				[valueField]: r.id,
				label: createRecordLabel(r, displayFields)
			};
		});
	}

	function filterString(text: string) {
		let base = filterSearchString(text);
		if (excludeIds.length > 0) {
			const exclude = excludeStringArray('id', excludeIds);
			base = `${base} && ${exclude}`;
		}
		return base;
	}

	function filterSearchString(text: string) {
		const searchString = getCollectionFieldNames(collection)
			.map((f) => `${f} ~ "${text}"`)
			.join(' || ');
		return `(${searchString})`;
	}

	//

	let record: PBResponse<RecordGeneric> | undefined = undefined;
	$: loadRecord(value);

	let actualPlaceholder: string | undefined = placeholder;
	$: setPlaceholder(record);

	async function loadRecord(value: string | undefined) {
		if (value) record = await pb.collection(collection).getOne(value);
		else record = undefined;
	}

	function setPlaceholder(maybeRecord: typeof record) {
		if (maybeRecord) actualPlaceholder = createRecordLabel(maybeRecord, displayFields);
		else actualPlaceholder = placeholder;
	}
</script>

<Svelecte
	{name}
	{valueField}
	{labelField}
	placeholder={actualPlaceholder}
	fetch={fetchOptions}
	{value}
	on:change={handleChange}
	{disabled}
	{required}
/>
