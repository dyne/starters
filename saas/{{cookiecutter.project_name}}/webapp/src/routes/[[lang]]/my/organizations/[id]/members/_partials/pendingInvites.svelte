<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import CollectionManager from '@/collections-components/manager/collectionManager.svelte';
	import type { OrganizationsResponse } from '@/pocketbase/types';
	import { m } from '$lib/i18n';
	import { Trash } from 'lucide-svelte';
	import Badge from '@/components/ui/badge/badge.svelte';
	import SectionTitle from '@/components/custom/sectionTitle.svelte';
	import { DeleteRecord } from '@/collections-components/manager';
	import IconButton from '$lib/components/iconButton.svelte';
	import PageCard from '@/components/custom/pageCard.svelte';

	//

	export let organization: OrganizationsResponse;
</script>

<CollectionManager
	collection="org_invites"
	filter={`organization.id = "${organization.id}"`}
	let:records
	hide={['emptyState']}
>
	{#if records.length}
		<PageCard class="!space-y-6">
			<SectionTitle
				tag="h4"
				title={m.Pending_invites()}
				description={m.pending_invites_description()}
			/>

			<div class="max-h-[400px] divide-y overflow-auto rounded-lg border">
				{#each records as invite}
					<div class="flex items-center justify-between px-2 py-1 pl-4">
						<div class="flex items-center gap-2">
							<p class="text-sm">
								{invite.user_email}
							</p>
							{#if invite.failed_email_send}
								<Badge color="red">{m.failed_email_send()}</Badge>
							{/if}
							{#if invite.declined}
								<Badge color="red">{m.invite_declined()}</Badge>
							{/if}
						</div>

						<DeleteRecord record={invite} let:openModal>
							<IconButton icon={Trash} on:click={openModal} />
						</DeleteRecord>
					</div>
				{/each}
			</div>
		</PageCard>
	{/if}
</CollectionManager>
