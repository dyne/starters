<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script>
	import { Button } from '@/components/ui/button';
	import { getUIShellContext } from '@/components/layout/uiShell.svelte';
	import { Menu } from 'lucide-svelte';
	import Icon from '@/components/custom/icon.svelte';

	const { toggleSidebar } = getUIShellContext();
</script>

<Button variant="outline" size="icon" on:click={toggleSidebar}>
	<Icon src={Menu} size={20} />
</Button>
