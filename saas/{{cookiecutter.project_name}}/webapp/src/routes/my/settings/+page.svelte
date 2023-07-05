<script lang="ts">
	import UserCard from './_partials/userData.svelte';
	import UserKeys from './_partials/userKeys.svelte';
	import { Card } from 'flowbite-svelte';
	import { features, featuresNames, isFeatureActive } from '$lib/features';
</script>

<div class="max-w-xl mx-auto space-y-8 p-8">
	<Card class="!max-w-none">
		<UserCard />
	</Card>
	{#if isFeatureActive($features,featuresNames.KEYPAIROOM)}
		<Card class="!max-w-none">
			<UserKeys />
		</Card>
	{/if}
</div>
