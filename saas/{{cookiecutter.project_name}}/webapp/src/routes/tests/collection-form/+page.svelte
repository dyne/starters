<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import CrudForm from '$lib/schema/CRUDForm.svelte';

	export let data;
</script>

<CrudForm
	collection={Collections.CrudexampleAllfields}
	initialData={data.item}
	hiddenFields={['text_with_regex', 'text']}
/>
