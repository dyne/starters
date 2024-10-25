<script lang="ts">
	import { CollectionManager } from '@/collections-components/manager';
	import { m } from '$lib/i18n';
	import { OrgRoles, ProtectedOrgUI } from '$lib/organizations';
	import Button from '@/components/ui/button/button.svelte';
	import { Pencil, Plus, X } from 'lucide-svelte';
	import Badge from '@/components/ui/badge/badge.svelte';
	import PageCard from '@/components/custom/pageCard.svelte';
	import SectionTitle from '@/components/custom/sectionTitle.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import UserAvatar from '@/components/custom/userAvatar.svelte';
	import { currentUser } from '@/pocketbase/index.js';
	import { c } from '$lib/utils/strings.js';
	import EditRecord from '@/collections-components/manager/ui/actions/editRecord.svelte';
	import DeleteRecord from '@/collections-components/manager/ui/actions/deleteRecord.svelte';
	import MembershipRequests from './_partials/membershipRequests.svelte';
	import { getUserDisplayName } from '$lib/utils/pb';
	import OrganizationLayout from '$lib/components/organizationLayout.svelte';
	import InviteMembersForm from './_partials/inviteMembersForm.svelte';
	import PendingInvites from './_partials/pendingInvites.svelte';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import Dialog from '@/components/custom/dialog.svelte';
	import Icon from '@/components/custom/icon.svelte';

	//

	export let data;
	$: organization = data.organization;
	$: userRole = data.userRole;

	//

	const showInviteModal = createToggleStore(false);
</script>

<OrganizationLayout org={organization}>
	<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
		<MembershipRequests {organization} />
		<PendingInvites {organization} />
	</ProtectedOrgUI>

	<PageCard>
		<CollectionManager
			collection="orgAuthorizations"
			expand={['user', 'role']}
			formOptions={{
				hide: { organization: organization.id },
				relations: {
					role: { mode: 'select', displayFields: ['name'] },
					user: { displayFields: ['name'] }
				}
			}}
			editFormOptions={{
				exclude: ['user']
			}}
			filter={`organization.id="${organization.id}"`}
			let:records
		>
			<SectionTitle title={m.Members()} description={m.members_description()}>
				<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']} slot="right">
					<Button on:click={showInviteModal.on}>
						<Plus size="20" class="mr-2" />
						{m.invite_members()}
					</Button>
				</ProtectedOrgUI>
			</SectionTitle>

			<div class="space-y-2">
				{#each records as record}
					{@const user = record.expand?.user}
					{@const role = record.expand?.role}
					{#if user && role && userRole}
						<PlainCard>
							<div class="flex items-center gap-4">
								<UserAvatar {user}></UserAvatar>
								<p>
									{getUserDisplayName(user)}
								</p>
								<div class="flex gap-2">
									{#if user.id == $currentUser?.id}
										<Badge>{m.You()}</Badge>
									{/if}
									{#if role.name != OrgRoles.MEMBER}
										<Badge>{c(role.name)}</Badge>
									{/if}
								</div>
							</div>

							<svelte:fragment slot="right">
								<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
									<div class="space-x-1">
										{#if userRole.level < role.level}
											<EditRecord {record} let:openModal>
												<Button color="primary" size="sm" on:click={openModal}>
													{m.Edit_role()}
													<Icon src={Pencil} ml></Icon>
												</Button>
											</EditRecord>

											<DeleteRecord {record} let:openModal>
												<Button color="primary" size="sm" on:click={openModal}>
													{m.Remove()}
													<Icon src={X} ml></Icon>
												</Button>
											</DeleteRecord>
										{/if}
									</div>
								</ProtectedOrgUI>
							</svelte:fragment>
						</PlainCard>
					{/if}
				{/each}
			</div>
		</CollectionManager>
	</PageCard>
</OrganizationLayout>

<Dialog bind:open={$showInviteModal} title={m.invite_members()} description="ao">
	<InviteMembersForm
		organizationId={organization.id}
		onSuccess={showInviteModal.off}
		onCancel={showInviteModal.off}
	/>
</Dialog>
