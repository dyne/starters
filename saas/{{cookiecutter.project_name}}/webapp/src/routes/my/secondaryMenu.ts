import type { MenuLink } from "$lib/uiShell/UiShell.svelte";
import { Cog, QuestionMarkCircle, ArrowRightOnRectangle } from "svelte-heros-v2";

const secondaryMenu:MenuLink[] = [
		{
			label: 'Settings',
			href: '/my/settings',
			icon: Cog
		},
		{
			label: 'Help',
			href: '/my/help',
			icon: QuestionMarkCircle
		},
		{
			label: 'Sign Out',
			href: '/my/signout',
			icon: ArrowRightOnRectangle
		}
	];

export default secondaryMenu;