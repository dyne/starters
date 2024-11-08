<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar/index.js';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { version } from '$app/environment';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { DropdownMenuItemProps } from 'bits-ui';

	import { getUserDidUrl } from '@/did';
	import { featureFlags } from '@/features';
	import { goto, m } from '@/i18n';
	import LanguageSelect from '@/i18n/languageSelect.svelte';

	import Logo from '@/components/layout/Logo.svelte';
	import { createOrganizationSidebarLinks } from '@/organizations';
	import { getUserRole } from '@/organizations/utils';
	import { appTitle } from '@/utils/strings';
	import { getUserDisplayName } from '@/pocketbase/utils';

	import { currentUser, pb } from '@/pocketbase';

	import SidebarButton from '@/components/layout/sidebar/sidebarButton.svelte';
	import SidebarItems from '@/components/layout/sidebar/sidebarItems.svelte';
	import * as Popover from '@/components/ui/popover';
	import { Separator } from '@/components/ui/separator';
	import T from '@/components/custom/t.svelte';
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
		ChevronUp,
		LogOut,
		File
	} from 'lucide-svelte';
	import type { IconComponent } from '@/components/types';
	import Icon from '@/components/custom/icon.svelte';
	import { cn } from '@/components/ui/utils';
	import { props } from 'lodash/fp';
	import UserAvatar from '@/components/custom/userAvatar.svelte';

	//

	// TODO - Improve subscription
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

<Sidebar.Root>
	<Sidebar.Header class="border-b">
		<Logo />
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{@render SidebarItem({ href: '/my/', title: m.Home(), icon: Home })}
					{@render SidebarItem({
						href: '/my/notifications',
						title: m.notifications(),
						icon: Inbox,
						disabled: true
					})}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="gap-0 p-0">
		{#if $currentUser}
			<Sidebar.Menu class="p-2">
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									{...props}
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<UserAvatar user={$currentUser} class="size-6" />
									{getUserDisplayName($currentUser)}
									<ChevronUp class="ml-auto" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>

						<DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
							{#if $featureFlags.DID}
								{#await getUserDidUrl() then href}
									{#if href}
										{@render DropdownMenuLink({
											title: m.my_DID(),
											icon: File,
											'data-sveltekit-preload-data': 'off',
											href,
											target: '_blank'
										})}
									{/if}
								{/await}
							{/if}

							{@render DropdownMenuLink({
								title: m.Go_Pro(),
								icon: Flame,
								'data-sveltekit-preload-data': 'off',
								href: '/',
								options: {
									disabled: true
								}
							})}

							{@render DropdownMenuLink({
								title: m.Sign_out(),
								icon: LogOut,
								'data-sveltekit-preload-data': 'off',
								href: '/logout'
							})}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
			<!-- {@const avatar = pb.getFileUrl($currentUser, 'avatar')}
				<Popover.Root>
					<Popover.Trigger>
						{#snippet child({ props })}
							<SidebarButton {...props} icon={avatar} text={getUserDisplayName($currentUser)} />
						{/snippet}
					</Popover.Trigger>

					<Popover.Content class="space-y-1 p-2">
						<SidebarButton text={m.My_profile()} icon={User} href="/my/profile" />

						{#if $featureFlags.DID}
							{#await getUserDidUrl() then url}
								<SidebarButton href={url} text={m.my_DID()} icon={File} target="_blank" />
							{/await}
						{/if}

						<SidebarButton href="/pricing" icon={Flame} text={m.Go_Pro()} disabled />

						<Separator />

						<SidebarButton
							href="/logout"
							data-sveltekit-preload-data="off"
							text={m.Sign_out()}
							icon={ArrowUpRightFromSquare}
						/>
					</Popover.Content>
				</Popover.Root> -->
		{/if}

		<div class="flex w-full overflow-hidden border-t p-2">
			<T
				tag="small"
				class="text-secondary-foreground/50 text-wrap font-mono text-xs leading-normal"
			>
				{appTitle} – Version {version}
			</T>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>

<!-- 
<Sidebar class="h-full">
	{#snippet top()}

	{/snippet}

	<div class="p-2">
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

			<div class="!mb-3">
				<SidebarItems
					links={[
						{
							text: m.My_organizations(),
							href: '/my/organizations',
							icon: SquareStack
						}
					]}
				/>
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

	{#snippet bottom()}
		<div class="p-2">
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

			<LanguageSelect>
				{#snippet trigger({ props, icon, text })}
					<SidebarButton {...props} {icon} {text} />
				{/snippet}
			</LanguageSelect>

			
		</div>


	{/snippet}
</Sidebar> -->

{#snippet SidebarItem({
	href,
	title,
	icon,
	disabled = false,
	onclick = () => {}
}: {
	href?: string;
	title: string;
	icon: IconComponent;
	disabled?: boolean;
	onclick?: () => void;
})}
	<Sidebar.MenuItem class={cn({ 'cursor-not-allowed opacity-20': disabled })}>
		<Sidebar.MenuButton onclick={disabled ? undefined : onclick}>
			{#snippet child({ props })}
				{#if href && !disabled}
					<a {href} {...props}>
						{@render SidebarButtonContent({ icon, title })}
					</a>
				{:else}
					<p {...props}>
						{@render SidebarButtonContent({ icon, title })}
					</p>
				{/if}
			{/snippet}
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{/snippet}

{#snippet SidebarButtonContent({ icon, title }: { icon: IconComponent; title: string })}
	<Icon src={icon} />
	<span>{title}</span>
{/snippet}

{#snippet DropdownMenuLink({
	title,
	icon,
	href,
	options,
	...rest
}: {
	title: string;
	href: string;
	icon?: IconComponent;
	options?: DropdownMenuItemProps;
} & HTMLAnchorAttributes)}
	<DropdownMenu.Item {...options} class="{options?.class} hover:cursor-pointer">
		{#snippet child({ props })}
			<a {href} {...props} {...rest}>
				{#if icon}
					<Icon src={icon} />
				{/if}
				<span>{title}</span>
			</a>
		{/snippet}
	</DropdownMenu.Item>
{/snippet}
