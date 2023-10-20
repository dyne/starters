<script lang="ts" context="module">
	export type RelationDisplayFields = string[];
</script>

<script lang="ts">
	import type { PBRecord } from '$lib/utils/types';

	import RelationsManager, {
		type InputMode as RelationInputMode
	} from '$lib/components/relationsManager.svelte';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from '../form.svelte';
	import type { Collections } from '$lib/pocketbase/types';
	import FieldWrapper from './fieldParts/fieldWrapper.svelte';
	import { writable } from 'svelte/store';
	import type { ComponentProps } from 'svelte';
	import { Button, Drawer, Heading } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { Plus } from 'svelte-heros-v2';
	import IconButton from '$lib/components/iconButton.svelte';
	import { RecordForm } from '$lib/recordForm';
	import { createTypeProp } from '$lib/utils/typeProp';

	export let field: string;
	export let label = '';
	export let collection: string | Collections;
	export let multiple = false;
	export let displayFields: RelationDisplayFields = [];
	export let max: number | undefined = undefined;
	export let inputMode: RelationInputMode = 'search';
	export let addRelatedRecordsButton: boolean = false;

	const { superform } = getFormContext();
	const { validate, form } = superform;
	const { value } = formFieldProxy(superform, field);

	type GenericRecord = $$Generic<PBRecord>;

	const recordProp = createTypeProp<GenericRecord>();

	$: if (Array.isArray($value) && $value.length > 0) validateField($value as any);

	async function validateField(value: string) {
		await validate(field);
	}

	function createModalStore(initialValue = false) {
		const open = writable(initialValue);
		function toggleDrawer() {
			open.update((v) => !v);
		}
		return { ...open, toggleDrawer };
	}

	const hideDrawer = createModalStore(true);
	const { toggleDrawer } = hideDrawer;

	//

	const drawerProps: ComponentProps<Drawer> = {
		transitionType: 'fly',
		backdrop: true,
		activateClickOutside: true,
		placement: 'right',
		transitionParams: {
			x: 320,
			duration: 200,
			easing: sineIn
		},
		class: '!p-6 !space-y-6',
		width: 'w-full md:w-4/5 lg:w-3/5'
	};
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
	/>
	{#if addRelatedRecordsButton}
		<div class="flex justify-end pt-4">
			<Button color="alternative" size="xs" on:click={toggleDrawer}>
				<Plus size="16" />
				<span class="ml-1">Add {label}</span>
			</Button>
		</div>
		<Drawer bind:hidden={$hideDrawer} {...drawerProps}>
			<div class="flex justify-between items-center">
				<Heading tag="h5">Create new {label}</Heading>
				<IconButton on:click={toggleDrawer}></IconButton>
			</div>
			<RecordForm
				recordType={recordProp}
				{collection}
				on:success={(e) => {
					$form.issuer = e.detail.record.id;
					toggleDrawer();
				}}
			/>
		</Drawer>
	{/if}
</FieldWrapper>
