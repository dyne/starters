<script lang="ts">
	import { version } from '$app/environment';
	import { getUserDidUrl } from '$lib/did';
	import { featureFlags } from '$lib/features';
	import { m } from '$lib/i18n';
	import LanguageSwitcher from '$lib/i18n/languageSelect.svelte';

	import Logo from '$lib/layout/Logo.svelte';
	import SidebarCloseButton from '$lib/layout/SidebarCloseButton.svelte';
	import { createOrganizationSidebarLinks } from '$lib/organizations';
	import { getUserRole } from '$lib/organizations/utils';
	import { appTitle } from '$lib/strings';
	import { getUserDisplayName } from '$lib/utils/pb';
	import Icon from '@/components/custom/icon.svelte';
	import T from '@/components/custom/t.svelte';

	import Sidebar from '@/components/layout/sidebar/sidebar.svelte';
	import SidebarButton from '@/components/layout/sidebar/sidebarButton.svelte';
	import SidebarItems from '@/components/layout/sidebar/sidebarItems.svelte';
	import { Button } from '@/components/ui/button';
	import * as Popover from '@/components/ui/popover';
	import { Separator } from '@/components/ui/separator';
	import { currentUser, pb } from '@/pocketbase';
	import type {
		OrganizationsResponse,
		OrgAuthorizationsResponse,
		OrgRolesResponse
	} from '@/pocketbase/types';

	import {
		ArrowUpRightFromSquare,
		Flame,
		Home,
		Inbox,
		CircleHelp,
		SquareStack,
		User,
		Ellipsis,
		File,
		Languages
	} from 'lucide-svelte';

	//

	function toggleSidebar() {}

	function getOrgAuthorizations() {
		type Authorizations = Required<
			OrgAuthorizationsResponse<{
				organization: OrganizationsResponse;
				role: OrgRolesResponse;
			}>
		>;

		return pb.collection('orgAuthorizations').getFullList<Authorizations>({
			filter: `user = "${pb.authStore.model!.id}"`,
			expand: 'organization,role',
			fetch,
			requestKey: null
		});
	}
</script>

<Sidebar>
	<svelte:fragment slot="top">
		<div class="flex items-center justify-between px-3 py-2.5">
			<Logo />
			<SidebarCloseButton />
		</div>
	</svelte:fragment>

	<div class="space-y-1 p-2">
		<SidebarItems
			links={[
				{
					text: m.Home(),
					href: '/my',
					icon: Home
				},
				{
					text: m.notifications(),
					icon: Inbox,
					href: '/my/notifications',
					disabled: true
				}
			]}
		/>
	</div>

	<Separator />

	{#if $featureFlags.ORGANIZATIONS}
		<div class="space-y-1 p-2">
			<div class="pb-1 pl-3 pt-1">
				<T tag="small" class=" text-xs font-bold uppercase tracking-wide">
					{m.organizations()}
				</T>
			</div>

			<SidebarItems
				links={[
					{
						text: m.My_organizations(),
						href: '/my/organizations',
						icon: SquareStack
					}
				]}
			/>

			<div class="p-3 pt-2">
				<Separator></Separator>
			</div>

			{#await getOrgAuthorizations() then authorizations}
				{#each authorizations as authorization}
					{@const organization = authorization.expand.organization}
					{@const organizationId = organization.id}
					{@const userId = $currentUser?.id ?? ''}
					{#await getUserRole(organizationId, userId) then userRole}
						{@const links = createOrganizationSidebarLinks(organization, m, userRole)}
						<SidebarItems {links} />
					{/await}
				{/each}
			{/await}
		</div>
	{/if}

	<svelte:fragment slot="bottom">
		<div class="space-y-1 p-2">
			<SidebarItems
				links={[
					{
						text: 'Help',
						icon: CircleHelp,
						href: '',
						disabled: true,
						target: '_blank'
					}
				]}
			/>

			<LanguageSwitcher>
				<svelte:fragment slot="trigger" let:builder let:icon let:text>
					<SidebarButton builders={[builder]} {icon} {text} />
				</svelte:fragment>
			</LanguageSwitcher>

			<!-- <LanguageSwitcher /> -->

			{#if $currentUser}
				{@const avatar = pb.getFileUrl($currentUser, 'avatar')}
				<Popover.Root>
					<Popover.Trigger asChild let:builder>
						<SidebarButton
							builders={[builder]}
							icon={avatar}
							text={getUserDisplayName($currentUser)}
						/>
					</Popover.Trigger>

					<Popover.Content class="space-y-1 p-2">
						<!-- <DropdownHeader>
							<span class="block truncate text-xs font-medium text-gray-500">
								{getUserDisplayName($currentUser)}
							</span>
						</DropdownHeader> -->
						<SidebarButton
							text={m.My_profile()}
							icon={User}
							href="/my/profile"
							on:click={toggleSidebar}
						/>

						{#if $featureFlags.DID}
							{#await getUserDidUrl() then url}
								<SidebarButton href={url} text={m.my_DID()} icon={File} target="_blank" />
							{/await}
						{/if}

						<SidebarButton
							href="/pricing"
							on:click={toggleSidebar}
							icon={Flame}
							text={m.Go_Pro()}
							disabled
						/>

						<Separator />

						<SidebarButton
							href="/logout"
							data-sveltekit-preload-data="off"
							text={m.Sign_out()}
							icon={ArrowUpRightFromSquare}
						/>
					</Popover.Content>
				</Popover.Root>
			{/if}
		</div>

		<div class=" flex border-t px-6 py-3">
			<T tag="small" class="text-primary/50 text-wrap font-mono text-xs">
				{appTitle} – Version {version}
			</T>
		</div>
	</svelte:fragment>
</Sidebar>
