<script lang="ts">
	import { enhance } from '$app/forms';
	import { Heading, P } from 'flowbite-svelte';
</script>

<form action="POST" use:enhance>
	<Heading tag="h4">Regenerate keys</Heading>
	<P>You've been redirected here because your private keys are missing.</P>
</form>
