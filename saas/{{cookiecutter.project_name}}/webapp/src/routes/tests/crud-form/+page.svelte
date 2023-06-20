<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import CrudForm from '$lib/schema/CRUDForm.svelte';

	export let data;
</script>

<div class="max-w-xl mx-auto p-4">
	<CrudForm collection={Collections.CrudExample} initialData={data.item} />
</div>
