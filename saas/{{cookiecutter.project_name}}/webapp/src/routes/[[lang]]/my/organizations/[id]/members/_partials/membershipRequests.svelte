<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import CollectionManager from '$lib/collectionManager/collectionManager.svelte';
	import { pb } from '@/pocketbase/index.js';
	import {
		Collections,
		OrgJoinRequestsStatusOptions,
		type OrgJoinRequestsRecord,
		type UsersResponse,
		type OrgJoinRequestsResponse,
		type OrganizationsResponse
	} from '@/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp.js';
	import { m } from '$lib/i18n';
	import { UserPlus, CircleOffIcon } from 'lucide-svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import { getUserDisplayName } from '$lib/utils/pb';
	import UserAvatar from '@/components/custom/userAvatar.svelte';
	import Icon from '@/components/custom/icon.svelte';
	import SectionTitle from '@/components/custom/sectionTitle.svelte';
	import ModalWrapper from '$lib/components/modalWrapper.svelte';
	import PageCard from '@/components/custom/pageCard.svelte';
	import { Button } from '@/components/ui/button';

	//

	export let organization: OrganizationsResponse;

	const recordType = createTypeProp<OrgJoinRequestsResponse<{ user: UsersResponse }>>();

	//

	const { accepted, rejected, pending } = OrgJoinRequestsStatusOptions;

	async function updateRequestStatus(
		request: OrgJoinRequestsResponse,
		status: OrgJoinRequestsStatusOptions
	) {
		await pb.collection('orgJoinRequests').update(request.id, {
			status
		} satisfies Partial<OrgJoinRequestsRecord>);
	}
</script>

<CollectionManager
	collection={Collections.OrgJoinRequests}
	initialQueryParams={{
		filter: `organization.id = "${organization.id}" && status = "${pending}"`,
		expand: 'user'
	}}
	{recordType}
	let:records
	hideEmptyState
>
	{#if records.length}
		<PageCard>
			<SectionTitle
				tag="h4"
				title={m.Pending_membership_requests()}
				description={m.pending_membership_requests_description()}
			/>

			{#each records as request}
				{@const user = request.expand?.user}
				{#if user}
					<PlainCard>
						<UserAvatar slot="left" size="md" {user}></UserAvatar>
						{getUserDisplayName(user)}

						<svelte:fragment slot="right">
							<div class="space-x-1">
								<Button variant="outline" on:click={() => updateRequestStatus(request, accepted)}>
									{m.Accept()}
									<Icon src={UserPlus} ml></Icon>
								</Button>

								<ModalWrapper title={m.Warning()} size="xs" let:openModal>
									<Button variant="outline" on:click={openModal}>
										{m.Decline()}
										<Icon src={CircleOffIcon} ml></Icon>
									</Button>

									<svelte:fragment slot="modal" let:closeModal>
										<p>{m.decline_membership_request_warning()}</p>
										<div class="flex items-center justify-center gap-2">
											<Button color="alternative" on:click={closeModal}>
												{m.Cancel()}
											</Button>
											<Button
												color="red"
												on:click={() => updateRequestStatus(request, rejected).then(closeModal)}
											>
												{m.decline_membership_request()}
											</Button>
										</div>
									</svelte:fragment>
								</ModalWrapper>
							</div>
						</svelte:fragment>
					</PlainCard>
				{/if}
			{/each}
		</PageCard>
	{/if}
</CollectionManager>
