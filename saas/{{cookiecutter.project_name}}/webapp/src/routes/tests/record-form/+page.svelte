<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Input from '$lib/forms/fields/input.svelte';
	import Toggle from '$lib/forms/fields/toggle.svelte';
	import { currentUser } from '$lib/pocketbase';
	import {
		Collections,
		type CrudExampleResponse,
		type FeaturesResponse,
		type UsersResponse
	} from '$lib/pocketbase/types';
	import { RecordForm } from '$lib/recordForm';
	import { createFieldComponent } from '$lib/recordForm/fieldSchemaToInput.svelte';
	import { createTypeProp } from '$lib/utils/typeProp';

	const recordType = createTypeProp<
		CrudExampleResponse<{
			relation: FeaturesResponse[];
			relation_single: FeaturesResponse;
			owner: UsersResponse;
		}>
	>();
</script>

<div class="mx-auto max-w-xl p-4">
	<RecordForm
		{recordType}
		collection={Collections.CrudExample}
		fieldsSettings={{
			relations: {
				relation: {
					displayFields: ['name', 'active'],
					inputMode: 'select'
				},
				relation_single: { displayFields: ['name'], inputMode: 'search' },
				owner: { displayFields: ['name', 'email'], inputMode: 'search' }
			},
			hide: { owner: $currentUser?.id },
			labels: {
				text: 'Name',
				file_only_pdf_json: 'PDF or JSON file',
				boolean: 'Test check'
			},
			components: {
				textarea: createFieldComponent(Input),
				boolean: createFieldComponent(Toggle)
			}
		}}
		on:success={invalidateAll}
	/>
</div>
