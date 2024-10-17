<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { IconComponent } from '@/components/types';
	import { Button } from '@/components/ui/button';

	export let icon: IconComponent = X;
	export let border = false;
	export let size: keyof typeof sizes = 'xs';
	export let href: string | undefined = undefined;

	const sizes = {
		xs: {
			iconSize: 20,
			padding: '!p-1'
		},
		sm: {
			iconSize: 20,
			padding: '!p-2'
		}
	};

	$: props = sizes[size];
</script>

<Button
	class={`${props.padding} ${!border ? '!border-transparent' : ''} !shrink-0`}
	variant="outline"
	on:click
	{href}
>
	<svelte:component this={icon} size={props.iconSize.toString()} />
</Button>
