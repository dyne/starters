<script lang="ts">
	import { ProtectedOrgLayout } from '$lib/rbac/index';
	import { Button, ButtonGroup, Heading, Hr, P } from 'flowbite-svelte';

	export let data;
	$: organization = data.organization;

	const href = (path: string) => `/my/organizations/${organization.id}/${path}`;
</script>

<!--  -->

<div class="flex justify-between items-center">
	<Heading tag="h3">{organization.name}</Heading>
	<div class="flex justify-end items-center space-x-4">
		<P color="text-gray-600" size="sm">Settings</P>
		<ButtonGroup>
			<Button href={href('general')}>General</Button>
			<Button href={href('members')}>Members</Button>
		</ButtonGroup>
	</div>
</div>

<Hr />

<ProtectedOrgLayout orgId={organization.id}>
	<slot />
</ProtectedOrgLayout>
