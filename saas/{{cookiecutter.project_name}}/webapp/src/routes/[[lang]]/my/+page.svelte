<script>
	import { featureFlags } from '$lib/features';
	import { WelcomeSession } from '$lib/utils/welcome';
	import SidebarGroup from '@/components/layout/sidebar/sidebarGroup.svelte';
	import SidebarLink from '@/components/layout/sidebar/sidebarLink.svelte';
	import { SunDim } from 'lucide-svelte';

	if (WelcomeSession.isActive()) WelcomeSession.end();
</script>

<SidebarLink href="/" text="ok" badge="ok"></SidebarLink>
<SidebarGroup
	text="ok"
	icon={SunDim}
	links={[
		{
			href: '/',
			text: 'no'
		},
		{
			href: '/',
			text: 'no'
		},
		{
			href: '/',
			text: 'no'
		}
	]}
></SidebarGroup>
<SidebarGroup
	text="ok"
	icon={SunDim}
	links={[
		{
			href: '/hhh',
			text: 'no'
		},
		{
			href: '/hhh',
			text: 'no'
		},
		{
			href: '/hhh',
			text: 'no'
		}
	]}
></SidebarGroup>

<div class="flex flex-col p-4">
	<a href="/my/profile">My profile</a>
	{#if $featureFlags.ORGANIZATIONS}
		<a href="/my/organizations">My organizations</a>
	{/if}
</div>
