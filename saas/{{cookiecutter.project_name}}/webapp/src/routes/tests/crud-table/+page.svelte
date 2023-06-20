<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import CrudTable from '$lib/schema/CRUDTable.svelte';
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
	/>
</div>
