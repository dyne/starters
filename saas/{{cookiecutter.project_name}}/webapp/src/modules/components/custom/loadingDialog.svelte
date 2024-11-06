<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import Spinner from './spinner.svelte';

	interface Props {
		loading?: boolean;
		children?: import('svelte').Snippet;
	}

	let { loading = $bindable(false), children }: Props = $props();
</script>

<AlertDialog.Root
	bind:open={loading}
	closeOnEscape={false}
	closeOnOutsideClick={false}
	portal="body"
>
	<AlertDialog.Content
		class="flex !w-1/5 !min-w-[150px] flex-col items-center justify-center gap-2"
		tabindex={null}
	>
		<Spinner />
		<AlertDialog.Description>
			{@render children?.()}
		</AlertDialog.Description>
	</AlertDialog.Content>
</AlertDialog.Root>
