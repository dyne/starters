<script lang="ts" context="module">
	export type RelationDisplayFields = string[];
</script>

<script lang="ts">
	import { Eye, Pencil } from 'svelte-heros-v2';

	import IconButton from '$lib/components/iconButton.svelte';

	import type { PBRecord } from '$lib/utils/types';

	import RelationsManager, {
		type InputMode as RelationInputMode
	} from '$lib/components/relationsManager.svelte';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from '../form.svelte';
	import type { Collections } from '$lib/pocketbase/types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';
	import { RecordForm } from '$lib/recordForm';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Button } from 'flowbite-svelte';

	export let field: string;
	export let label = '';
	export let collection: string | Collections;
	export let multiple = false;
	export let displayFields: RelationDisplayFields = [];
	export let max: number | undefined = undefined;
	export let inputMode: RelationInputMode = 'search';
	export let addRelatedRecordsButton: boolean = true;

	const { superform } = getFormContext();
	const { validate, form } = superform;
	const { value } = formFieldProxy(superform, field);

	type GenericRecord = $$Generic<PBRecord>;

	const recordProp = createTypeProp<GenericRecord>();

	$: if (Array.isArray($value) && $value.length > 0) validateField($value as any);

	async function validateField(value: string) {
		await validate(field);
	}
	let toggleDrawer: () => void;
	let edit: boolean = false;
</script>

<FieldWrapper {field} {label}>
	<RelationsManager
		name={field}
		bind:relation={$value}
		{collection}
		{multiple}
		{displayFields}
		{max}
		mode={inputMode}
		addButtonText={addRelatedRecordsButton ? `Add ${label}` : undefined}
		bind:toggleDrawer
	>
		<svelte:fragment slot="actions" let:record>
			{#if record}
				<IconButton
					icon={edit ? Eye : Pencil}
					on:click={() => {
						edit = !edit;
					}}
				/>
			{/if}
		</svelte:fragment>

		<svelte:fragment let:record>
			{#if !record || (record && edit)}
				<RecordForm
					recordType={recordProp}
					recordId={record?.id}
					initialData={record}
					{collection}
					on:success={(e) => {
						!multiple ? $form[field].push(e.detail.record.id) : ($form[field] = e.detail.record.id);
						toggleDrawer();
					}}
				/>
			{:else}
				<pre>
					{JSON.stringify(record, null, 2)}
				</pre>
			{/if}
		</svelte:fragment>
	</RelationsManager>
</FieldWrapper>
