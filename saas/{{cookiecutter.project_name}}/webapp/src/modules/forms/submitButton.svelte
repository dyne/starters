<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';
	import type { ComponentProps } from 'svelte';
	import { nanoid } from 'nanoid';

	export let id = `submit-${nanoid(5)}`;
	export let color: ComponentProps<Button>['color'] = 'primary';

	const { superform } = getFormContext();
	const { allErrors } = superform;

	$: hasErrors = $allErrors.length > 0;
</script>

<Button {id} {color} type="submit" disabled={hasErrors}>
	<slot />
</Button>
