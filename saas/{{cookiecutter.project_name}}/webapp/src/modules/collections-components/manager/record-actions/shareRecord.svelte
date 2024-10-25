<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import Dialog from '@/components/custom/dialog.svelte';

	import T from '@/components/custom/t.svelte';

	import Spinner from '@/components/custom/spinner.svelte';

	import { Button } from '@/components/ui/button';

	import PortalWrapper from '$lib/components/portalWrapper.svelte';

	import type { PBResponse } from '$lib/utils/types';

	import { createTypeProp } from '$lib/utils/typeProp';

	import { Collections, type AuthorizationsResponse } from '@/pocketbase/types';

	import { CollectionForm } from '@/collections-components';
	import { currentUser, pb } from '@/pocketbase';
	import { ArrowLeft, Share, Trash } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	type RecordGeneric = $$Generic<PBResponse>;
	export let record: RecordGeneric;

	const dispatch = createEventDispatcher<{ add: undefined; remove: undefined }>();

	/* */

	let open = false;
	const openModal = () => {
		open = true;
	};

	/* Load */

	let authorization: AuthorizationsResponse | undefined;
	let authorizationRequest = loadAuthorization();
	let recordType = createTypeProp<AuthorizationsResponse>();

	async function loadAuthorization() {
		try {
			authorization = await pb
				.collection(Collections.Authorizations)
				.getFirstListItem<AuthorizationsResponse>(`record_id="${record.id}"`);
		} catch (e) {
			authorization = undefined;
		}
	}

	/* Success */

	function handleSuccess() {
		open = false;
		dispatch('add');
	}

	/* Remove */

	let removeAccess = false;
	let removeLoading = false;

	function toggleRemoveAccess() {
		removeAccess = !removeAccess;
	}

	async function removeAuthorization() {
		if (!authorization) return;
		removeLoading = true;
		await pb.collection('authorizations').delete(authorization.id);
		open = false;
		dispatch('remove');
	}
</script>

<slot {openModal}>
	<Button
		class="!p-2"
		variant="outline"
		on:click={() => {
			openModal();
		}}
	>
		<Share size="20" />
	</Button>
</slot>

{#await authorizationRequest}
	<Spinner />
{:then response}
	<PortalWrapper>
		<Dialog bind:open title="Share signature">
			<div class="relative w-full">
				{#if !removeAccess}
					<!-- <CollectionForm
						{recordType}
						on:success={handleSuccess}
						initialData={authorization}
						recordId={authorization?.id}
						submitButtonText="Share"
						collection={Collections.Authorizations}
						fieldsSettings={{
							hide: {
								record_id: record.id,
								collection_id: record.collectionId,
								owner: $currentUser?.id
							},
							relations: {
								users: {
									displayFields: ['email']
								}
							}
						}}
					/>
					{#if authorization}
						<div class="absolute bottom-0 left-0">
							<Button color="red" variant="outline" on:click={toggleRemoveAccess}>
								<Trash size="20" />
								<span class="ml-2"> Remove access </span>
							</Button>
						</div>
					{/if} -->
				{:else if removeLoading}
					<Spinner />
				{:else}
					<!-- TODO - review message -->
					<T>Are you sure you want to remove all access to the signature?</T>
					<div class="mt-4 flex justify-between">
						<Button class="space-x-2" color="alternative" on:click={toggleRemoveAccess}>
							<ArrowLeft size="20" />
							<span class="ml-2"> Undo </span>
						</Button>
						<Button class="space-x-2" color="red" on:click={removeAuthorization}>
							<Trash size="20" />
							<span class="ml-2"> Yes, remove access </span>
						</Button>
					</div>
				{/if}
			</div>
		</Dialog>
	</PortalWrapper>
{/await}
