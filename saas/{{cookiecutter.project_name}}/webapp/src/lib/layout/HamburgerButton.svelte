<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script>
	import { Button } from '@/components/ui/button';
	import { getUIShellContext } from './UiShell.svelte';
	import { Menu } from 'lucide-svelte';

	const { toggleSidebar } = getUIShellContext();
</script>

<Button variant="outline" class="!p-1.5" on:click={toggleSidebar}>
	<Menu size="24" />
</Button>
