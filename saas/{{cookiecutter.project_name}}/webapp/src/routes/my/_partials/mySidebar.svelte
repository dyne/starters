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
	import { createOrganizationSidebarLinks, type OrgRole } from '@/organizations';
	import { getUserRole } from '@/organizations/utils';
	import { appTitle } from '@/utils/strings';
	import { getUserDisplayName } from '@/pocketbase/utils';

	import { currentUser, pb } from '@/pocketbase';

	import SidebarItems from '@/components/layout/sidebar/sidebarItems.svelte';
	import T from '@/components/custom/t.svelte';

	import {
		Flame,
		Home,
		Inbox,
		CircleHelp,
		SquareStack,
		ChevronUp,
		ChevronDown,
		LogOut,
		File
	} from 'lucide-svelte';
	import type { IconComponent } from '@/components/types';
	import Icon from '@/components/custom/icon.svelte';
	import { cn } from '@/components/ui/utils';
	import UserAvatar from '@/components/custom/userAvatar.svelte';
	import type { Snippet } from 'svelte';
	import { PocketbaseQuery } from '@/pocketbase/query';
	import { Trigger } from '@/components/ui/alert-dialog';

	//

	const authorizationsQuery = new PocketbaseQuery('orgAuthorizations', {
		filter: `user = "${pb.authStore.model!.id}"`,
		expand: ['organization', 'role']
	});
</script>

<Sidebar.Root>
	<Sidebar.Header class="border-b">
		<Logo />
	</Sidebar.Header>

	<Sidebar.Content class="gap-0 ">
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

		{#if $featureFlags.ORGANIZATIONS}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{m.organizations()}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{@render SidebarItem({
							href: '/my/organizations',
							title: m.My_organizations(),
							icon: SquareStack
						})}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>

			<Sidebar.Menu class="gap-0">
				{#await authorizationsQuery.getFullList() then authorizations}
					{#each authorizations as authorization}
						{@const organization = authorization.expand?.organization!}
						{@const role = authorization.expand?.role!}

						{@render DropdownCollapsibleGroup({ trigger, content })}
						{#snippet trigger()}
							{organization.name}
						{/snippet}

						{#snippet content()}
							{@const links = createOrganizationSidebarLinks(organization, m, role.name as OrgRole)}
							{#each links as l}
								{@render SidebarItem({ href: l.href, title: l.text, icon: l.icon })}
							{/each}
						{/snippet}
					{/each}
				{/await}
			</Sidebar.Menu>
		{/if}
	</Sidebar.Content>

	<Sidebar.Footer class="gap-0 border-t p-0">
		{#if $currentUser}
			<Sidebar.Menu class="p-2">
				{@render SidebarItem({ href: '', title: m.Help(), icon: CircleHelp, disabled: true })}

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

<!-- TODO - Make "component" and add active state -->
{#snippet DropdownCollapsibleGroup({ trigger, content }: { trigger: Snippet; content: Snippet })}
	<Collapsible.Root open class="group/collapsible">
		<Sidebar.Group>
			<Sidebar.GroupLabel>
				{#snippet child({ props })}
					<Collapsible.Trigger {...props}>
						{@render trigger()}
						<ChevronDown
							class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
						/>
					</Collapsible.Trigger>
				{/snippet}
			</Sidebar.GroupLabel>
			<Collapsible.Content>
				<Sidebar.GroupContent>
					{@render content()}
				</Sidebar.GroupContent>
			</Collapsible.Content>
		</Sidebar.Group>
	</Collapsible.Root>
{/snippet}
