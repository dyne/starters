<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar/index.js';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Collapsible from '@/components/ui/collapsible';
	import { version } from '$app/environment';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { DropdownMenuItemProps } from 'bits-ui';

	import { getUserDidUrl } from '@/did';
	import { featureFlags } from '@/features';
	import { goto, m } from '@/i18n';
	import LanguageSelect from '@/i18n/languageSelect.svelte';

	import Logo from '@/components/layout/Logo.svelte';
	import { createOrganizationLinks, type OrgRole } from '@/organizations';
	import { getUserRole } from '@/organizations/utils';
	import { appTitle } from '@/utils/strings';
	import { getUserDisplayName } from '@/pocketbase/utils';
	import { currentUser, pb } from '@/pocketbase';
	import T from '@/components/custom/t.svelte';
	import {
		Flame,
		Home,
		Inbox,
		CircleHelp,
		SquareStack,
		ChevronUp,
		LogOut,
		File
	} from 'lucide-svelte';
	import type { IconComponent } from '@/components/types';
	import Icon from '@/components/custom/icon.svelte';
	import UserAvatar from '@/components/custom/userAvatar.svelte';
	import { PocketbaseQuery } from '@/pocketbase/query';
	import SidebarLink from '@/components/layout/sidebar/sidebarLink.svelte';
	import SidebarGroup from '@/components/layout/sidebar/sidebarGroup.svelte';
	import SidebarItemIcon from '@/components/layout/sidebar/sidebarItemIcon.svelte';
	import { OrganizationAvatar } from '@/organizations/components';
	import { page } from '$app/stores';

	//

	const authorizationsQuery = new PocketbaseQuery('orgAuthorizations', {
		filter: `user = "${pb.authStore.model!.id}"`,
		expand: ['organization', 'role']
	});

	const sidebarState = Sidebar.useSidebar();
</script>

<Sidebar.Root>
	<Sidebar.Header class="flex flex-row items-center justify-between border-b">
		<Logo />
		{#if sidebarState.isMobile}
			<Sidebar.Trigger variant="outline" class="size-9" />
		{/if}
	</Sidebar.Header>

	<Sidebar.Content class="gap-0">
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<SidebarLink href="/my" title={m.Home()} icon={Home} />
					<SidebarLink href="/my/notifications" title={m.notifications()} icon={Inbox} disabled />
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		{#if $featureFlags.ORGANIZATIONS}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{m.organizations()}</Sidebar.GroupLabel>
				<Sidebar.GroupContent class="space-y-1">
					<Sidebar.Menu>
						<SidebarLink href="/my/organizations" title={m.My_organizations()} icon={SquareStack} />
					</Sidebar.Menu>

					{#await authorizationsQuery.getFullList() then authorizations}
						{#each authorizations as authorization}
							{@const organization = authorization.expand?.organization!}
							{@const role = authorization.expand?.role!}
							{@const active = $page.url.pathname.includes(`/my/organizations/${organization.id}`)}
							<SidebarGroup {active}>
								{#snippet trigger()}
									<SidebarItemIcon>
										<OrganizationAvatar {organization} class="size-5 border" />
									</SidebarItemIcon>
									<span>{organization.name}</span>
								{/snippet}

								{#snippet content()}
									{@const links = createOrganizationLinks(organization.id, role.name as OrgRole)}

									{#each links as link}
										<SidebarLink {...link} sub />
									{/each}
								{/snippet}
							</SidebarGroup>
						{/each}
					{/await}
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/if}
	</Sidebar.Content>

	<Sidebar.Footer class="gap-0 border-t p-0">
		<Sidebar.Menu class="p-2">
			<SidebarLink href="" title={m.Help()} icon={CircleHelp} disabled />

			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								{...props}
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<!-- TODO - Insert language switch -->

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

			{#if $currentUser}
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									{...props}
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<SidebarItemIcon>
										<UserAvatar user={$currentUser} class="size-6" />
									</SidebarItemIcon>
									<span>{getUserDisplayName($currentUser!)}</span>

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
			{/if}
		</Sidebar.Menu>

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
