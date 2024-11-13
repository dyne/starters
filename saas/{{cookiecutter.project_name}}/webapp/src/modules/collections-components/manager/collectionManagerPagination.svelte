<script lang="ts">
	import { getCollectionManagerContext } from './collectionManagerContext';
	import * as Pagination from '@/components/ui/pagination';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { paginationContext, pocketbaseQuery } = getCollectionManagerContext();
	const { currentPage: currentPageStore, totalItems } = paginationContext;

	let perPage = $derived($pocketbaseQuery.options.perPage);
	let show = $derived(perPage && ($totalItems ?? 0) > perPage);
</script>

{#if show && perPage}
	<Pagination.Root
		count={$totalItems ?? 0}
		{perPage}
		bind:page={$currentPageStore}
		class={className}
	>
		{#snippet children({ currentPage, pages })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<!-- <Pagination.Item isVisible={currentPage == page.value}> -->
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage == page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
{/if}
