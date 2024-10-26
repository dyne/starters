<script>
	import { featureFlags } from '@/features';
	import { WelcomeSession } from '@/auth/welcome';

	if (WelcomeSession.isActive()) WelcomeSession.end();
</script>

<div class="flex flex-col p-4">
	<a href="/my/profile">My profile</a>
	{#if $featureFlags.ORGANIZATIONS}
		<a href="/my/organizations">My organizations</a>
	{/if}
</div>
