<script lang="ts">
	import '../app.postcss';
	import { features } from '$lib/pocketbase';

	export let data;
	$features = data.features;
</script>

<slot />
