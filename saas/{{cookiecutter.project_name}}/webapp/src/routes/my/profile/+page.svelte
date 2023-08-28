<script lang="ts">
	import UserData from './_partials/userData.svelte';
	import UserKeys from './_partials/userKeys.svelte';
	import { Card } from 'flowbite-svelte';
	import { featureFlags, FeatureDisplay } from '$lib/features';
</script>

<div class="max-w-xl mx-auto space-y-8 p-8">
	<Card class="!max-w-none">
		<UserData />
	</Card>
	<FeatureDisplay flags={$featureFlags.KEYPAIROOM}>
		<Card class="!max-w-none">
			<UserKeys />
		</Card>
	</FeatureDisplay>
</div>
