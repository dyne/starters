<script lang="ts" generics="C extends CollectionName">
	import { toast } from 'svelte-sonner';
	import { getExceptionMessage } from '@/utils/errors';
	import type { MaybePromise } from '@/utils/types';
	import { m } from '@/i18n';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import Dialog from '@/components/custom/dialog.svelte';
	import T from '@/components/custom/t.svelte';
	import Alert from '@/components/custom/alert.svelte';
	import { Button } from '@/components/ui/button';
	import Icon from '@/components/custom/icon.svelte';
	import { onDestroy } from 'svelte';
	import { getCollectionManagerContext } from '../collectionManagerContext';
	import { Trash, X } from 'lucide-svelte';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { CollectionResponses } from '@/pocketbase/types';

	//

	export let record: CollectionResponses[C];
	export let dialogTitle = m.Delete_record();
	export let beforeDelete: (record: CollectionResponses[C]) => MaybePromise<void> = () => {};

	let { recordService } = getCollectionManagerContext<C>();

	//

	const dialogState = createToggleStore(false);

	let error: string | undefined = undefined;

	async function deleteRecord(record: CollectionResponses[C]) {
		error = undefined;
		try {
			await beforeDelete(record);
			await recordService.delete(record.id);
			dialogState.off();
			toast.info(m.Record_deleted_successfully());
		} catch (e) {
			error = getExceptionMessage(e);
		}
	}

	onDestroy(() => {
		error = undefined;
	});
</script>

<Dialog bind:open={$dialogState} title={dialogTitle}>
	<svelte:fragment slot="trigger" let:builder>
		<slot name="trigger" openModal={dialogState.on} {builder}>
			<Button variant="outline" size="icon" builders={[builder]}>
				<Icon src={Trash} />
			</Button>
		</slot>
	</svelte:fragment>

	<div class="space-y-6">
		<T>{m.Are_you_sure_you_want_to_delete_this_record()}</T>

		{#if error}
			<Alert variant="destructive">
				<p class="font-bold">{m.Error()}</p>
				<p>{error}</p>
			</Alert>
		{/if}

		<div class="flex justify-center gap-2">
			<Button variant="destructive" on:click={() => deleteRecord(record)}>
				<Icon src={Trash} mr />
				{m.Delete()}
			</Button>

			<Button variant="outline" on:click={dialogState.off}>
				<Icon src={X} mr />
				{m.Cancel()}
			</Button>
		</div>
	</div>
</Dialog>
