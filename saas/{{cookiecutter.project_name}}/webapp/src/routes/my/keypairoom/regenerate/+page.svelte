<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Heading, P, Textarea } from 'flowbite-svelte';
</script>

<form method="post" use:enhance class="space-y-4">
	<Heading tag="h4">Regenerate keys</Heading>
	<P>You've been redirected here because your private keys are missing.</P>
	<P>Please type here your seed:</P>
	<Textarea placeholder="sad" />
	<Button>Regenerate keys</Button>
</form>
