<script lang="ts">
	import { CollectionManager } from '@/collections-management';
</script>

<CollectionManager collection="z_test_collection" let:records>
	<ul>
		{#each records as record}
			<li><pre>{JSON.stringify(record)}</pre></li>
		{/each}
	</ul>
</CollectionManager>
