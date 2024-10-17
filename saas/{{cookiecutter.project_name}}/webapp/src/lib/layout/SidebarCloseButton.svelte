<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { getUIShellContext } from './UiShell.svelte';
	import { X } from 'lucide-svelte';

	const { isSidebarHidden } = getUIShellContext();
</script>

<Button variant="outline" class="!p-1.5" on:click={() => ($isSidebarHidden = true)}>
	<X size="24" />
</Button>
