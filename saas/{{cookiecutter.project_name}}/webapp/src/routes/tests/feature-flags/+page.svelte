<script lang="ts">
	import { featureFlags, FeatureDisplay } from '$lib/features';
</script>

<div class="p-4 space-y-8">
	<h1>Features data</h1>
	{#each Object.entries($featureFlags) as [name, flag]}
		<div class="space-y-2">
			<p>Feature: {name} | Active: {flag}</p>
			<div class="flex gap-4 items-stretch">
				<div class="font-mono w-0 grow bg-gray-200 overflow-x-auto p-4 rounded-lg">
					<FeatureDisplay flags={flag}>
						<div>
							This is feature {name} and it is {flag ? 'active' : 'not active'}
						</div>
					</FeatureDisplay>
					<FeatureDisplay flags={!flag}>
						<p class="text-gray-400">This feature is not active</p>
					</FeatureDisplay>
				</div>
			</div>
		</div>
	{/each}
</div>
