<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { getHMAC, regenerateKeypair, saveKeypairToLocalStorage } from '$lib/auth/keypair';
	import { log } from 'debug';
	import { A, Button, Heading, P, Textarea } from 'flowbite-svelte';

	export let data;

	let success = false;

	const onSubmit: SubmitFunction = async ({ data: formData, cancel }) => {
		try {
			const seed = formData.get('seed') as string;
			const hmac = await getHMAC(data.user?.email);
			const keypair = await regenerateKeypair(seed, hmac);
			saveKeypairToLocalStorage(keypair);
			success = true;
		} catch (e) {
			log(e, JSON.stringify(e));
			cancel();
		}

		return async ({ result }) => {
			await applyAction(result);
		};
	};

	const textAreaPlaceholder =
		'skin buyer sunset person run push elevator under debris soft surge man';
</script>

{#if !success}
	<form method="post" use:enhance={onSubmit} class="space-y-4 p-6 flex flex-col">
		<Heading tag="h4">Regenerate keys</Heading>
		<P>You've been redirected here because your private keys are missing.</P>
		<P>Please type here your seed:</P>
		<Textarea name="seed" placeholder={textAreaPlaceholder} />
		<Button type="submit">Regenerate keys</Button>
		<A href="/my/keypairoom">Forgot the seed? Regenerate it</A>
	</form>
{:else}
	<div class="space-y-4 p-6 flex flex-col">
		<Heading tag="h4">Keys regenerated!</Heading>
		<P>
			Your keys have been regenerated. You can now go back to
			<A href="/my/dashboard">your profile</A>.
		</P>
	</div>
{/if}
