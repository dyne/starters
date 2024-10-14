<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { Moon } from 'svelte-loading-spinners';

	export let loading = false;
</script>

<AlertDialog.Root bind:open={loading} closeOnEscape={false} closeOnOutsideClick={false}>
	<AlertDialog.Content class="flex flex-col items-center justify-center gap-2">
		<Moon size={40} color="black"></Moon>
		<AlertDialog.Description>
			<slot></slot>
		</AlertDialog.Description>
	</AlertDialog.Content>
</AlertDialog.Root>
