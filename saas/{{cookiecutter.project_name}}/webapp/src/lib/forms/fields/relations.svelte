<script lang="ts" context="module">
	export type RelationDisplayFields = string[];
</script>

<script lang="ts">
	import type { PBRecord } from '$lib/utils/types';

	import RelationsManager, {
		type RecordsManagerOptions
	} from '$lib/components/records/recordsManager.svelte';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from '../form.svelte';
	import type { Collections } from '$lib/pocketbase/types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let field: string;
	export let label: string | undefined = undefined;
	export let collection: string | Collections;
	export let options: Partial<RecordsManagerOptions<RecordGeneric>> = {};

	//

	const { superform } = getFormContext();
	const { validate } = superform;
	const { value } = formFieldProxy(superform, field);

	$: if (Array.isArray($value) && $value.length > 0) validate($value as any);
</script>

<FieldWrapper {field} {label}>
	<RelationsManager {recordType} {collection} bind:value={$value} options={{ ...options }} />
</FieldWrapper>
