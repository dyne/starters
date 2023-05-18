<script lang="ts">
	import '../app.postcss';
	import { featureFlags } from '$lib/pocketbase';

	export let data;
	$featureFlags = data.featureFlags;
</script>

<slot />
