<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts" context="module">
	import type { RecordsManagerOptions } from '$lib/components/records/recordsManager.svelte';
	import type { FieldComponentProp } from './fieldSchemaToInput.svelte';
	import type {
		PBResponse,
		ExtractPBRecord,
		ExtractPBExpand,
		StringKeys,
		ArrayExtract
	} from '$lib/utils/types';

	type Keys<R extends PBResponse> = StringKeys<ExtractPBRecord<R>>;

	export type FieldsSettings<R extends PBResponse = PBResponse> = {
		labels: { [K in Keys<R>]?: string };
		descriptions: { [K in Keys<R>]?: string };
		placeholders: { [K in Keys<R>]?: string };
		order: Array<Keys<R>>;
		exclude: Array<Keys<R>>;
		hide: { [K in Keys<R>]?: R[K] };
		defaults: { [K in Keys<R>]?: R[K] };
		relations: {
			[K in Keys<R>]?: K extends keyof ExtractPBExpand<R>
				? RecordsManagerOptions<ArrayExtract<ExtractPBExpand<R>[K]>>
				: RecordsManagerOptions;
		};
		components: { [K in Keys<R>]?: FieldComponentProp };
	};
</script>

<script lang="ts">
	import { m } from '$lib/i18n';

	import { c } from '$lib/utils/strings';

	import type { FormSettings } from '$lib/forms/form.svelte';

	import { createEventDispatcher } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import type { Collections } from '$lib/pocketbase/types';
	import type { FieldSchema } from '$lib/pocketbase/schema/types';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject } from 'zod';
	import type { ClientResponseErrorData } from '$lib/errorHandling';

	import { Form, createForm, createFormData, FormError, SubmitButton } from '$lib/forms';
	import {
		cleanFormDataFiles,
		getFileFieldsInitialData,
		mockFileFieldsInitialData
	} from './recordFormSetup';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { getCollectionSchema } from '$lib/pocketbase/schema';
	import { fieldsSchemaToZod } from '$lib/pocketbaseToZod';
	import FieldSchemaToInput from './fieldSchemaToInput.svelte';
	import { Button } from 'flowbite-svelte';

	//

	type RecordGeneric = $$Generic<PBResponse>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	//

	export let collection: Collections | string;
	export let initialData: Partial<RecordGeneric> = {};
	export let recordId = '';

	export let fieldsSettings: Partial<FieldsSettings<RecordGeneric>> = {};
	let {
		order = [],
		exclude = [],
		hide,
		labels,
		components,
		relations,
		placeholders,
		descriptions,
		defaults = {}
	} = fieldsSettings;

	export let formSettings: Partial<FormSettings> = {};

	export let submitButtonText = '';
	export let showCancelButton = false;

	//

	const dispatch = createEventDispatcher<{
		success: {
			record: RecordGeneric;
		};
		edit: {
			record: RecordGeneric;
		};
		create: {
			record: RecordGeneric;
		};
		cancel: {};
	}>();

	/* Schema generation */

	const collectionSchema = getCollectionSchema(collection)!;
	const fieldsSchema = collectionSchema.schema.sort(sortFieldsSchema).filter(filterFieldsSchema);
	const zodSchema = fieldsSchemaToZod(fieldsSchema);

	/* Superform creation */

	let superform: SuperForm<AnyZodObject, ClientResponseErrorData>;

	$: {
		let seededData = { ...defaults, ...initialData }; // "defaults" must be overwritten by "initialData"
		if (hide) seededData = { ...seededData, ...hide };

		const mockedData = mockFileFieldsInitialData(collectionSchema, seededData);
		const fileFieldsInitialData = getFileFieldsInitialData(collectionSchema, initialData);

		superform = createForm(
			zodSchema,
			async ({ form }) => {
				const data = cleanFormDataFiles(form.data, fileFieldsInitialData);
				const formData = createFormData(data);
				let record: RecordGeneric;
				if (Boolean(recordId)) {
					record = await pb.collection(collection).update(recordId, formData);
					dispatch('edit', { record });
				} else {
					record = await pb.collection(collection).create(formData);
					dispatch('create', { record });
				}
				dispatch('success', { record });
			},
			mockedData,
			{
				dataType: 'form',
				...formSettings
			}
		);
	}

	/* Schema filters */

	function sortFieldsSchema(a: any, b: any) {
		const aIndex = order.indexOf(a.name);
		const bIndex = order.indexOf(b.name);
		if (aIndex === -1 && bIndex === -1) {
			return 0;
		}
		if (aIndex === -1) {
			return 1;
		}
		if (bIndex === -1) {
			return -1;
		}
		return aIndex - bIndex;
	}

	function filterFieldsSchema(schema: FieldSchema) {
		return !exclude.includes(schema.name as Keys<RecordGeneric>);
	}

	/* */

	submitButtonText = Boolean(submitButtonText)
		? submitButtonText
		: Boolean(recordId)
			? 'Edit record'
			: 'Create record';
</script>

<Form {superform} showRequiredIndicator>
	{#each fieldsSchema as fieldSchema}
		{@const name = fieldSchema.name}
		{@const hidden = hide ? Object.keys(hide).includes(name) : false}
		{@const label = c(labels?.[name] ?? name)}
		{@const component = components?.[name]}
		{@const relationInputOptions = relations?.[name] ?? {}}
		{@const description = descriptions?.[name]}
		{@const placeholder = placeholders?.[name]}
		<FieldSchemaToInput
			{description}
			{label}
			{fieldSchema}
			{hidden}
			{component}
			{relationInputOptions}
			{placeholder}
		/>
	{/each}

	<FormError />

	<div class="flex justify-end gap-2">
		{#if showCancelButton}
			<Button color="alternative" on:click={() => dispatch('cancel', {})}>{m.Cancel()}</Button>
		{/if}
		<SubmitButton>{submitButtonText}</SubmitButton>
	</div>
</Form>
