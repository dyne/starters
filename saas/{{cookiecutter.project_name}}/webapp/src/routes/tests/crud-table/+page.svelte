<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import CrudTable from '$lib/schema/CRUDTable.svelte';

	export let data;
</script>

<div class="p-4">
	<CrudTable
		collection={Collections.CrudExample}
		displayFields={['id', 'text', 'relation_single', 'relation']}
		actions={[
			{
				name: 'ciao',
				function: (r) => {
					console.log(r);
				}
			}
		]}
		relationsDisplayFields={{
			relation_single: ['name', 'culo'],
			relation: ['name', 'culo']
		}}
		formHiddenFields={['owner']}
		formHiddenFieldsValues={{ owner: data.user?.id }}
	/>
</div>
