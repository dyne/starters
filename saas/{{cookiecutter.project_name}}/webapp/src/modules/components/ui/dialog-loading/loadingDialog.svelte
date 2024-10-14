<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { Moon } from 'svelte-loading-spinners';

	export let loading = false;
</script>

<AlertDialog.Root>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<!-- <Dialog.Root bind:open={loading} closeOnEscape={false} closeOnOutsideClick={false}>
	<Dialog.Content hideCloseButton class="flex items-center justify-center gap-2">
		<Moon size={40} color="black"></Moon>
		{#if $$slots.default}
			<Dialog.Description>
				<slot></slot>
			</Dialog.Description>
		{/if}
	</Dialog.Content>
</Dialog.Root> -->
