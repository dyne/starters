<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import T from '@/components/custom/t.svelte';

	export let number: number;
	export let text: string;
</script>

<div
	class="border-primary-300 bg-primary-50 flex w-fit flex-col items-center rounded-lg border p-6"
>
	<T tag="h3" class="text-primary-600 w-fit">{number}</T>
	<T class="text-primary-600">{text}</T>
</div>
