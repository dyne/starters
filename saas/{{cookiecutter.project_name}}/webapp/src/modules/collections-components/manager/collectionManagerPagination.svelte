<script lang="ts">
	import { getCollectionManagerContext } from './collectionManagerContext';
	import * as Pagination from '@/components/ui/pagination';

	const { paginationContext, fetchOptions } = getCollectionManagerContext();
	const { currentPage: currentPageStore, totalItems } = paginationContext;
</script>

{#if $fetchOptions.perPage}
	<Pagination.Root
		count={$totalItems ?? 0}
		perPage={$fetchOptions.perPage}
		bind:page={$currentPageStore}
		let:pages
		let:currentPage
	>
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
	</Pagination.Root>
{/if}
