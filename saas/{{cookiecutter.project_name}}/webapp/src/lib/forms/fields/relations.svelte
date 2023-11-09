<script lang="ts" context="module">
	export type RelationDisplayFields = string[];
</script>

<script lang="ts">
	import FieldComponentRenderer from '$lib/collectionManager/ui/fieldComponents/fieldComponentRenderer.svelte';
	import type { FieldComponent } from '$lib/collectionManager/ui/fieldComponents/fieldComponentRenderer.svelte';

	import { Eye, Pencil } from 'svelte-heros-v2';

	import IconButton from '$lib/components/iconButton.svelte';

	import type { PBRecord } from '$lib/utils/types';

	import RelationsManager, {
		type InputMode as RelationInputMode
	} from '$lib/components/records/recordsManager.svelte';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from '../form.svelte';
	import type { Collections } from '$lib/pocketbase/types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';
	import { RecordForm, type FieldsSettings } from '$lib/recordForm';
	import { createTypeProp } from '$lib/utils/typeProp';

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	export let field: string;
	export let label = '';
	export let collection: string | Collections;
	export let multiple = false;
	export let displayFields: RelationDisplayFields = [];
	export let extendedDisplayFields: RelationDisplayFields = [];
	export let max: number | undefined = undefined;
	export let inputMode: RelationInputMode = 'search';
	export let showCreateButton: boolean = true;
	export let showEditButton: boolean = true;
	export let fieldsComponents: Record<string, FieldComponent> = {};
	export let formFieldsSettings: Partial<FieldsSettings<RecordGeneric>>;

	const { superform } = getFormContext();
	const { validate, form } = superform;
	const { value } = formFieldProxy(superform, field);

	type GenericRecord = $$Generic<PBRecord>;

	const recordProp = createTypeProp<GenericRecord>();

	$: valueIsArray = Array.isArray($value);

	$: if (valueIsArray && $value.length > 0) validateField($value as any);

	async function validateField(value: string) {
		await validate(value);
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
		addButtonText={showCreateButton ? `Add ${label}` : undefined}
		bind:toggleDrawer
	>
		<svelte:fragment slot="actions" let:record>
			{#if showEditButton && record}
				<IconButton
					icon={edit ? Eye : Pencil}
					on:click={() => {
						edit = !edit;
					}}
				/>
			{/if}
		</svelte:fragment>

		<svelte:fragment let:record>
			{#if record && !edit}
				<div class="space-y-2">
					{#each extendedDisplayFields as field}
						{@const component = fieldsComponents[field]}
						<FieldComponentRenderer {record} {field} {component} showLabel />
					{/each}
				</div>
			{:else}
				<RecordForm
					recordType={recordProp}
					recordId={record?.id}
					initialData={record}
					{collection}
					on:success={(e) => {
						multiple ? $form[field].push(e.detail.record.id) : ($form[field] = e.detail.record.id);
						toggleDrawer();
					}}
				/>
			{/if}
		</svelte:fragment>
	</RelationsManager>
</FieldWrapper>
