<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { ProtectedOrgLayout } from '$lib/rbac/index';
	import { A, Button, ButtonGroup, Heading, Hr, P } from 'flowbite-svelte';

	export let data;
	$: organization = data.organization;
	$: avatarPath = pb.files.getUrl(organization, organization.avatar);

	const href = (path = '') => `/my/organizations/${organization.id}${path}`;
</script>

<!--  -->

<div class="flex justify-between items-center">
	<Heading tag="h3"><A href={href()}>{organization.name}</A></Heading>
	<div class="flex justify-end items-center space-x-4">
		<P color="text-gray-600" size="sm">Settings</P>
		<ButtonGroup>
			<Button href={href('/general')}>General</Button>
			<Button href={href('/members')}>Members</Button>
		</ButtonGroup>
	</div>
</div>

<Hr />

<ProtectedOrgLayout orgId={organization.id}>
	<slot />
</ProtectedOrgLayout>
