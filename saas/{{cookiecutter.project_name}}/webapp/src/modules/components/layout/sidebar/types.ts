import type { IconComponent } from '@/components/types';

export type BaseSidebarItemProps = {
	text: string;
	icon?: IconComponent | string;
	disabled?: boolean;
};

export type SidebarLinkProps = BaseSidebarItemProps & {
	href: string;
	badge?: string;
};

export type SidebarGroupProps = BaseSidebarItemProps & {
	links: SidebarLinkProps[];
};

export type SidebarItemProps = SidebarGroupProps | SidebarLinkProps;
