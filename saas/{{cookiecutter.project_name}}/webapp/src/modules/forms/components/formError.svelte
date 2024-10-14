<script lang="ts">
	import * as Alert from '@/components/ui/alert';
	import { getFormContext } from '@/forms';
	import { m } from '$lib/i18n';
	import { FORM_ERROR_PATH } from '../form';

	const { superform } = getFormContext();
	const { allErrors } = superform;

	$: error = $allErrors.find((e) => e.path == FORM_ERROR_PATH);
</script>

{#if error}
	<Alert.Root variant="destructive">
		<Alert.Title>{m.Error()}</Alert.Title>
		<Alert.Description>
			{#if error.messages.length > 0}
				{#each error.messages as message}
					{message}
				{/each}
			{/if}
		</Alert.Description>
	</Alert.Root>
{/if}
