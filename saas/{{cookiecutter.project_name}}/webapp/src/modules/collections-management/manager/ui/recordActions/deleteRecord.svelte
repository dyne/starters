<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import Dialog from '@/components/custom/dialog.svelte';

	import T from '@/components/custom/t.svelte';

	import Alert from '@/components/custom/alert.svelte';

	import { Button } from '@/components/ui/button';

	import Icon from '@/components/custom/icon.svelte';

	import { onDestroy } from 'svelte';
	import { getErrorMessage } from '$lib/errorHandling';

	import PortalWrapper from '$lib/components/portalWrapper.svelte';

	import type { PBResponse } from '$lib/utils/types';
	import { getRecordsManagerContext } from '../../collectionManager.svelte';

	import { Trash, X } from 'lucide-svelte';

	type RecordGeneric = $$Generic<PBResponse>;
	export let record: RecordGeneric;

	export let modalTitle = 'Delete record';
	export let beforeDelete = () => {};

	let { dataManager } = getRecordsManagerContext();
	let { loadRecords, recordService } = dataManager;

	let error: string | undefined = undefined;

	async function deleteRecord() {
		error = undefined;
		beforeDelete();
		try {
			await recordService.delete(record.id);
			loadRecords();
			open = false;
		} catch (e) {
			error = getErrorMessage(e);
		}
	}

	onDestroy(() => {
		error = undefined;
	});

	let open = false;

	function openModal() {
		open = true;
	}
</script>

<slot {openModal}>
	<Button class="!p-2" color="alternative" on:click={openModal}>
		<Trash size="20" />
	</Button>
</slot>

<PortalWrapper>
	<Dialog bind:open title={modalTitle}>
		<div class="space-y-6 text-center">
			<T>Are you sure you want to delete this record?</T>

			{#if error}
				<Alert variant="destructive" class="text-left">
					<p class="font-bold">Error</p>
					<p>{error}</p>
				</Alert>
			{/if}

			<div class="flex justify-center gap-2">
				<Button color="red" on:click={deleteRecord}>
					<Trash size="20" /><span class="ml-1">Delete</span>
				</Button>
				<Button
					color="alternative"
					on:click={() => {
						open = false;
					}}
				>
					<Icon src={X} mr></Icon>
					<span class="ml-1">Cancel</span>
				</Button>
			</div>
		</div>
	</Dialog>
</PortalWrapper>
