<script>
	import { goto } from '$app/navigation';
	import UserAvatar from '$lib/components/userAvatar.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';
	import { Fire } from 'svelte-heros-v2';
</script>

<button id="avatar-menu">
	<UserAvatar />
</button>
<Dropdown
	placement="bottom"
	triggeredBy="#avatar-menu"
	footerClass="w-full min-h-screen md:w-fit md:min-h-fit"
>
	<DropdownHeader>
		<span class="block truncate text-sm font-medium">{$currentUser?.email}</span>
	</DropdownHeader>
	<DropdownItem href="/my/profile">My profile</DropdownItem>
	<DropdownDivider />
	<DropdownItem href="/pro" class="flex items-center"
		><Fire class="text-red-500 mr-2 w-5" /> Go Pro</DropdownItem
	>
	<DropdownDivider />
	<DropdownItem on:click={() => goto('/my/logout')} class="text-primary-600">Sign out</DropdownItem>
</Dropdown>
