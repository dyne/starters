<script lang="ts">
	import OrganizationLayout from '$lib/components/organizationLayout.svelte';

	export let data;
	const { organization } = data;
</script>

<OrganizationLayout org={organization}>
	<pre>{JSON.stringify(organization, null, 2)}</pre>
</OrganizationLayout>
