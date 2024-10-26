<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { currentUser, pb } from '@/pocketbase/index.js';
	import {
		OrgJoinRequestsStatusOptions,
		type OrgJoinRequestsRecord,
		type OrganizationsResponse
	} from '@/pocketbase/types';
	import { m } from '@/i18n';
	import PageTop from '@/components/custom/pageTop.svelte';
	import Icon from '@/components/custom/icon.svelte';
	import { ArrowLeft, Users, UserPlus } from 'lucide-svelte';
	import SectionTitle from '@/components/custom/sectionTitle.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '@/components/custom/pageCard.svelte';
	import EmptyState from '@/components/custom/emptyState.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import ModalWrapper from '$lib/components/modalWrapper.svelte';
	import { CollectionManager } from '@/collections-components';

	import { Button } from '@/components/ui/button';
	import Avatar from '@/components/custom/avatar.svelte';
	import T from '@/components/custom/t.svelte';

	//

	async function sendJoinRequest(org: OrganizationsResponse) {
		pb.collection('orgJoinRequests').create({
			user: $currentUser?.id!,
			organization: org.id!,
			status: OrgJoinRequestsStatusOptions.pending,
			reminders: 0
		} satisfies OrgJoinRequestsRecord);
	}
</script>

<PageTop>
	<Button href="/my/organizations" variant="outline" size="sm">
		<Icon src={ArrowLeft} mr></Icon>
		{m.Back_to_my_organizations()}
	</Button>

	<SectionTitle tag="h3" title={m.Join_an_organization()} hideLine></SectionTitle>
</PageTop>

<PageContent>
	<PageCard>
		<CollectionManager
			collection="organizations"
			fetchOptions={{
				filter: `(id != orgAuthorizations_via_organization.organization.id) && (orgAuthorizations_via_organization.user.id = "${$currentUser?.id}")`,
				inverseExpand: {
					orgJoinRequests: 'organization',
					orgAuthorizations: 'organization'
				},
				subscribe: ['orgJoinRequests']
			}}
			let:records
		>
			<svelte:fragment slot="emptyState">
				<EmptyState title={m.No_available_organizations_found()} icon={Users} />
			</svelte:fragment>

			{#if records.length > 0}
				<div class="space-y-2">
					{#each records as org}
						{@const avatarUrl = pb.files.getUrl(org, org.avatar)}
						{@const hasDescription = Boolean(org.description)}
						{@const sentMembershipRequest = org.expand?.orgJoinRequests_via_organization?.at(0)}
						{@const orgAuthorization = org.expand?.orgAuthorizations_via_organization?.at(0)}

						{#if !orgAuthorization}
							<PlainCard let:Title let:Description>
								<div class="flex items-center gap-4">
									<Avatar src={avatarUrl} class="shrink-0" />
									<div>
										<Title>{org.name}</Title>
										{#if hasDescription}
											<Description>
												<span class="line-clamp-2">
													{@html org.description}
												</span>
											</Description>
										{/if}
									</div>
								</div>

								<div slot="right" class="shrink-0 self-start pl-8">
									{#if !sentMembershipRequest}
										<ModalWrapper title={`${m.Send_a_request_to()} ${org.name}`} let:openModal>
											<Button variant="outline" on:click={openModal}>
												{m.Join()}
												<Icon src={UserPlus} ml></Icon>
											</Button>

											<svelte:fragment slot="modal" let:closeModal>
												<T>{m.Please_confirm_that_you_want_to_join_this_organization_()}</T>
												<div class="flex items-center justify-center gap-2">
													<Button color="alternative" on:click={closeModal}>
														{m.Cancel()}
													</Button>
													<Button on:click={() => sendJoinRequest(org).then(closeModal)}>
														{m.Send_join_request()}
													</Button>
												</div>
											</svelte:fragment>
										</ModalWrapper>
									{:else}
										<Button color="alternative" disabled>{m.Request_sent()}</Button>
									{/if}
								</div>
							</PlainCard>
						{/if}
					{/each}
				</div>
			{/if}
		</CollectionManager>
	</PageCard>
</PageContent>
