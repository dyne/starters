<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Moon } from 'svelte-loading-spinners';

	type $$Props = ComponentProps<Moon>;

	export let size: $$Props['size'] = 40;
	export let color: $$Props['color'] = 'black';
</script>

<Moon {size} {color} {...$$props} />
