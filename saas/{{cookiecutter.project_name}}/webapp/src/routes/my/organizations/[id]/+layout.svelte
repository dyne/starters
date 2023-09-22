<script lang="ts">
	import { Button, ButtonGroup, Heading, Hr, P, A } from 'flowbite-svelte';

	export let data;
	$: organization = data.organization;

	const href = (path: string) => `/my/organizations/${organization.id}/${path}`;
</script>

<A href="/my/organizations" class="mb-4">← My organizations</A>
<div class="flex justify-between items-center">
	<div>
		<Heading tag="h3">{organization.name}</Heading>
		<P size="base" color="text-gray-400">Manage your organization</P>
	</div>
	<div>
		<ButtonGroup>
			<Button href={href('general')}>General</Button>
			<Button href={href('members')}>Members</Button>
		</ButtonGroup>
	</div>
</div>

<Hr />

<slot />
