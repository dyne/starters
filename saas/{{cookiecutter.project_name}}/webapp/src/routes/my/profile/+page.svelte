<script lang="ts">
	import UserData from './_partials/userData.svelte';
	import UserKeys from './_partials/userKeys.svelte';
	import UserWebauthn from './_partials/userWebauthn.svelte';

	import { Card } from 'flowbite-svelte';
	import { featuresNames } from '$lib/features';
	import FeatureFlag from '$lib/components/featureFlag.svelte';
</script>

<div class="max-w-xl mx-auto space-y-8 p-8">
	<Card class="!max-w-none">
		<UserData />
	</Card>

	<FeatureFlag flag={featuresNames.KEYPAIROOM}>
		<Card class="!max-w-none">
			<UserKeys />
		</Card>
	</FeatureFlag>

	<FeatureFlag flag={featuresNames.WEBAUTHN}>
		<Card class="!max-w-none">
			<UserWebauthn />
		</Card>
	</FeatureFlag>
</div>
