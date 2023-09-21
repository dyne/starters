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
	<slot />
</Dropdown>
