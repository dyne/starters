<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
	import type { ActionData } from './$types';
	import { A, Button, Hr, Input, Label, P } from 'flowbite-svelte';

	export let form: ActionData;
	export let data;
</script>

<form
	method="POST"
	class="flex flex-col space-y-6"
	use:enhance={() => {
		return async ({ result }) => {
			pb.authStore.loadFromCookie(document.cookie);
			await applyAction(result);
		};
	}}
>
	<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Create an account</h3>

	<Hr />

	<Label class="space-y-2">
		<span>Your email</span>
		<Input type="email" name="email" placeholder="name@company.com" required />
	</Label>

	<Hr />

	<div class="space-y-2">
		<Label>Login questions</Label>
		<P size="sm" color="text-gray-400 dark:text-gray-600">
			Please answer at least three of the following questions.<br />
			Remember the answers, as they will be used for login.
		</P>
	</div>

	{#each Object.entries(data.questions) as [key, question]}
		<Label class="space-y-2">
			<span>{question}</span>
			<Input type="text" name={key} />
		</Label>
	{/each}

	<Hr />

	<div class="flex items-start">
		<label class="flex items-center">
			<input type="checkbox" id="terms" name="terms" class="mr-2 rounded-[4px]" required />
			I accept the&nbsp;
			<A href="/">Terms and Conditions</A>
		</label>
	</div>

	<Button type="submit">Register!</Button>
	<Hr />

	<P size="sm" align="center">
		Already have an account?
		<A href="/login">Login here</A>
	</P>
	{#if form?.error}
		<pre class="bg-red-100">{JSON.stringify(form, null, 2)}</pre>
	{/if}
</form>
