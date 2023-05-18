<script lang="ts">
	import FeatureFlag from '$lib/components/featureFlag.svelte';
</script>

<div class="p-4 space-y-3 flex flex-col">
	<FeatureFlag flag="Test flag 1">
		<div>not displaying, cause not active</div>
	</FeatureFlag>
	<hr class="border-b" />
	<FeatureFlag flag="Test flag 2">
		<div>displaying, cause active</div>
	</FeatureFlag>
</div>
