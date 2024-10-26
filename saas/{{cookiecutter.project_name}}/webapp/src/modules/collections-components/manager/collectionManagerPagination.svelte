<script lang="ts">
	import { goto } from '$lib/i18n';
	import { getRecordsManagerContext } from './collectionManager.svelte';

	import * as Pagination from '@/components/ui/pagination';

	const { pagination } = getRecordsManagerContext();
	let { perPage } = pagination;
	// const { perPage, currentPage, totalPages, totalItems } = dataManager;

	// function handlePaginationClick(e: Event) {
	// 	e.preventDefault();
	// 	goto((e.target as any)?.href);
	// }
	// $: pages = Array.from({ length: $totalPages }, (_, i) => ({
	// 	name: `${i + 1}`,
	// 	href: `?page=${i + 1}`
	// }));
</script>

{#if perPage}
	<Pagination.Root count={100} {perPage} let:pages let:currentPage>
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

<!-- 
{#if $totalPages > 1}
	<div class="my-5 flex flex-col items-center justify-center gap-2">
		<div class="text-sm text-gray-700 dark:text-gray-400">
			Showing <span class="font-semibold text-gray-900 dark:text-white"
				>{$perPage * Number($currentPage) - $perPage + 1}</span
			>
			to
			<span class="font-semibold text-gray-900 dark:text-white"
				>{Number($currentPage) == $totalPages ? $totalItems : $perPage * Number($currentPage)}</span
			>
			of <span class="font-semibold text-gray-900 dark:text-white">{$totalItems}</span> Entries
		</div>

		<div class="flex w-full justify-center">
			<!-- <Pagination
				{pages}
				activeClass="bg-blue-500 text-white"
				on:previous={(e) => {
					e.preventDefault();
					if (Number($currentPage) - 1 < 1) return;
					goto(`?page=${Number($currentPage) - 1}`);
				}}
				on:next={(e) => {
					e.preventDefault();
					if (Number($currentPage) + 1 > $totalPages) return;
					goto(`?page=${Number($currentPage) + 1}`);
				}}
				on:click={handlePaginationClick}
			/> -->
