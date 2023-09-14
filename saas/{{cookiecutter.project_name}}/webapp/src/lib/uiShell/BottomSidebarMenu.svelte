<script>
	import { SidebarBottomNav, SidebarBottomNavItem } from 'flowbite-svelte-blocks';
	import SelectCountries from './SelectCountries.svelte';
</script>

<SidebarBottomNav divClass="absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full bg-white dark:bg-gray-800 z-20">
	<SidebarBottomNavItem href="/my/profile" tooltip="Profile">
		<svg
			aria-hidden="true"
			class="w-6 h-6"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
			/></svg
		>
	</SidebarBottomNavItem>
	<SidebarBottomNavItem href="/my/profile" tooltip="Settings page">
		<svg
			aria-hidden="true"
			class="w-6 h-6"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
				clip-rule="evenodd"
			/></svg
		>
	</SidebarBottomNavItem>
	<SelectCountries />
</SidebarBottomNav>
