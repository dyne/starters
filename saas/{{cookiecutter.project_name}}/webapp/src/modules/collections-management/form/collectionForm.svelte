<script lang="ts" context="module">
	import type { RecordsManagerOptions } from '@/collections-management/records/recordsManager.svelte';
	import type { FieldComponentProp } from './fieldSchemaToInput.svelte';
	import type {
		PBResponse,
		ExtractPBRecord,
		ExtractPBExpand,
		StringKeys,
		ArrayExtract
	} from '$lib/utils/types';
	import type { CollectionName } from '@/pocketbase/collections-models/types';

	import { Form, type FormOptions } from '@/forms';
	import type { ComponentProps } from 'svelte';
	import type { GenericRecord } from '@/utils/types';

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

	type FormSettings<Data extends GenericRecord> = FormOptions<Data> & ComponentProps<Form<Data>>;
</script>

<script lang="ts" generics="C extends CollectionName">
	import type { CollectionRecords } from '@/pocketbase/types';
	import { Button } from '@/components/ui/button';
	import { zod } from 'sveltekit-superforms/adapters';
	import { m } from '$lib/i18n';
	import { c } from '$lib/utils/strings';
	import { createEventDispatcher } from 'svelte';
	import { pb } from '@/pocketbase';

	import { getCollectionModel } from '@/pocketbase/collections-models';
	import type { AnyFieldConfig } from '@/pocketbase/collections-models/types';
	import { createCollectionZodSchema } from '@/pocketbase/zod-schema';

	import type { SuperForm } from 'sveltekit-superforms/client';

	import { createForm, FormError, SubmitButton } from '@/forms';

	import {
		cleanFormDataFiles,
		getFileFieldsInitialData,
		mockFileFieldsInitialData
	} from './recordFormSetup';
	import FieldSchemaToInput from './fieldSchemaToInput.svelte';

	//

	export let collection: C;
	export let initialData: Partial<CollectionRecords[C]> = {};
	export let recordId: string | undefined = undefined;

	export let fieldsSettings: Partial<FieldsSettings<CollectionRecords[C]>> = {};
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

	export let formSettings: Partial<FormSettings<CollectionRecords[C]>> = {};

	export let submitButtonText = '';
	export let showCancelButton = false;

	//

	const dispatch = createEventDispatcher<{
		success: {
			record: CollectionRecords[C];
		};
		edit: {
			record: CollectionRecords[C];
		};
		create: {
			record: CollectionRecords[C];
		};
		cancel: {};
	}>();

	/* Schema generation */

	const collectionModel = getCollectionModel(collection);
	const fieldsSchema = collectionModel.schema.sort(sortFieldsSchema).filter(filterFieldsSchema);
	const zodSchema = createCollectionZodSchema(collection).omit(
		// @ts-ignore
		// TODO - Improve type handling here
		Object.fromEntries(exclude.map((key) => [key, true]))
	);

	/* Superform creation */

	let form: SuperForm<GenericRecord>;

	$: {
		let seededData = { ...defaults, ...initialData }; // "defaults" must be overwritten by "initialData"
		if (hide) seededData = { ...seededData, ...hide };

		const mockedData = mockFileFieldsInitialData(collectionModel, seededData);
		const fileFieldsInitialData = getFileFieldsInitialData(collectionModel, initialData);
		// TODO Fix- types
		// @ts-ignore
		form = createForm({
			// @ts-ignore
			adapter: zod(zodSchema),

			onSubmit: async ({ form }) => {
				const data = cleanFormDataFiles(form.data, fileFieldsInitialData);
				// @ts-ignore
				// const formData = createFormData(data);
				let record: RecordGeneric;
				if (Boolean(recordId)) {
					record = await pb.collection(collection).update(recordId, form.data);
					dispatch('edit', { record });
				} else {
					record = await pb.collection(collection).create(form.data);
					dispatch('create', { record });
				}
				dispatch('success', { record });
			},
			// @ts-ignore
			initialData: mockedData, // TODO : improve typings
			options: {
				dataType: 'form',
				...formSettings
			}
		});
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

	function filterFieldsSchema(schema: AnyFieldConfig) {
		return !exclude.includes(schema.name as Keys<RecordGeneric>);
	}

	/* */

	submitButtonText = Boolean(submitButtonText)
		? submitButtonText
		: Boolean(recordId)
			? 'Edit record'
			: 'Create record';
</script>

<Form {form} showRequiredIndicator hide={['submitButton']}>
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
			<Button variant="outline" on:click={() => dispatch('cancel', {})}>{m.Cancel()}</Button>
		{/if}
		<SubmitButton>{submitButtonText}</SubmitButton>
	</div>
</Form>
