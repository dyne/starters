<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script>
	import UserAvatar from '@/components/custom/userAvatar.svelte';
	import { currentUser } from '@/pocketbase';
</script>

<button id="avatar-menu">
	{#if $currentUser}
		<UserAvatar user={$currentUser} />
	{/if}
</button>
<!-- <Dropdown
	placement="bottom"
	triggeredBy="#avatar-menu"
	footerClass="w-full min-h-screen md:w-fit md:min-h-fit"
>
	<slot />
</Dropdown> -->
