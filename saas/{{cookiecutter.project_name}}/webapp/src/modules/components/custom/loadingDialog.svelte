<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import Spinner from './spinner.svelte';

	export let loading = false;
</script>

<AlertDialog.Root bind:open={loading} closeOnEscape={false} closeOnOutsideClick={false}>
	<AlertDialog.Content
		class="flex !w-1/5 !min-w-[150px] flex-col items-center justify-center gap-2"
		tabindex={-1}
	>
		<Spinner />
		<AlertDialog.Description>
			<slot></slot>
		</AlertDialog.Description>
	</AlertDialog.Content>
</AlertDialog.Root>
