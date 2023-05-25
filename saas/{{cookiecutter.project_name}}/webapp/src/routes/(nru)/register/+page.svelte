<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
	import { Register } from 'flowbite-svelte-blocks';
	import { Button, Checkbox, Label, Input } from 'flowbite-svelte';
	import type { ActionData } from './$types';
	import { appTitle } from '$lib/strings';

	export let form: ActionData;
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
	<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Create and account</h3>
	<Label class="space-y-2">
		<span>Your email</span>
		<Input type="email" name="email" placeholder="name@company.com" required />
	</Label>
	<Label class="space-y-2">
		<span>Your password</span>
		<Input type="password" name="password" placeholder="•••••" required />
	</Label>

	<Label class="space-y-2">
		<span>Confirm password</span>
		<Input type="password" name="passwordConfirm" placeholder="•••••" required />
	</Label>
	<div class="flex items-start">
		<Checkbox
			>I accept the <a
				class="font-medium text-primary-600 hover:underline dark:text-primary-500"
				href="/"
			>
				Terms and Conditions</a
			></Checkbox
		>
	</div>

	<Button type="submit" class="w-full1">Create an account</Button>

	<p class="text-sm font-light text-gray-500 da rk:text-gray-400">
		Already have an account?
		<a href="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500"
			>Login here</a
		>
	</p>
	{#if form?.error}
		<pre class="bg-red-100">{JSON.stringify(form, null, 2)}</pre>
	{/if}
</form>
