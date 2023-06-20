<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import CrudTable from '$lib/schema/CRUDTable.svelte';
	import Chip from '$lib/components/table/cells/chip.svelte';
	import File from '$lib/components/table/cells/file.svelte';
</script>

<div class="p-4">
	<CrudTable
		collection={Collections.CrudExample}
		fields={['id', 'image', 'text', 'relation_single', 'relation']}
		fieldsDisplay={{
			text: Chip,
			image: File
		}}
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
