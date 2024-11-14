<script lang="ts">
	import SectionTitle from '@/components/ui-custom/sectionTitle.svelte';
	import RecordCreate from './record-actions/recordCreate.svelte';
	import { getCollectionManagerContext } from './collectionManagerContext';

	interface Props {
		title?: string | undefined;
		hideCreate?: boolean;
	}

	let { title = undefined, hideCreate = false }: Props = $props();

	const { collection } = getCollectionManagerContext();
</script>

<SectionTitle title={title ?? collection}>
	{#snippet right()}
		{#if !hideCreate}
			<RecordCreate />
		{/if}
	{/snippet}
</SectionTitle>
