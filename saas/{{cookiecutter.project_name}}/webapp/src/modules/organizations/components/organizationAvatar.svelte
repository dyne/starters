<script lang="ts">
	import Avatar from '@/components/custom/avatar.svelte';
	import { pb } from '@/pocketbase';
	import type { OrganizationsRecord } from '@/pocketbase/types';

	interface Props {
		organization: OrganizationsRecord;
	}

	let { organization }: Props = $props();

	let src = $derived(pb.files.getUrl(organization, organization.avatar ?? ''));
	let fallback = $derived(organization.name.slice(0, 2));
</script>

<Avatar {src} {fallback} class="rounded-sm" />
