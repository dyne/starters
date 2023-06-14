<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import CrudTable from '$lib/schema/CRUDTable.svelte';
</script>

<CrudTable collection={Collections.CrudExample} displayFields={['id', 'text']} />
