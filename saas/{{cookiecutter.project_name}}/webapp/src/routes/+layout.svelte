<script lang="ts">
	import '../app.postcss';
	import { version } from '$app/environment';
	console.info(`SAAS version: 🔖 ${version}`);
</script>

<slot />
