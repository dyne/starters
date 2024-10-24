<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { pb } from '@/pocketbase';
	import type { PBResponse } from '$lib/utils/types';
	import { ArrowDownSquareIcon } from 'lucide-svelte';

	type RecordGeneric = $$Generic<PBResponse>;
	export let record: RecordGeneric;
	export let value: string;

	let url = '';
	if (record) url = pb.files.getUrl(record, value);
</script>

{#if url}
	<!-- TODO - fix -->
	<!-- <Button href={url} target="_blank" class="!p-2" color="alternative">
		<ArrowDownSquareIcon size="20" />
	</Button>
	<Tooltip>Download: {value}</Tooltip> -->
{/if}
