<script context="module" lang="ts">
	export const formKeys = {
		email: 'email',
		password: 'password',
		passwordConfirm: 'passwordConfirm',
		acceptTerms: 'acceptTerms'
	} as const;
</script>

<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
	import { Button, Checkbox, Label, Input, Alert, A } from 'flowbite-svelte';
	import type { ActionData } from './$types';

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
		<Input type="email" name={formKeys.email} placeholder="name@company.com" required />
	</Label>
	<Label class="space-y-2">
		<span>Your password</span>
		<Input type="password" name={formKeys.password} placeholder="•••••" required />
	</Label>

	<Label class="space-y-2">
		<span>Confirm password</span>
		<Input type="password" name={formKeys.passwordConfirm} placeholder="•••••" required />
	</Label>
	<div class="flex items-start">
		<Checkbox name={formKeys.acceptTerms} value="true" required>
			I accept the <A href="/" class="ml-1">Terms and Conditions</A>
		</Checkbox>
	</div>

	<Button type="submit" class="w-full1">Create an account</Button>

	<p class="text-sm text-gray-500 dark:text-gray-400">
		Already have an account?
		<A href="/login">Login here</A>
	</p>
	{#if form?.error}
		<Alert dismissable={false} accent={false} color="red">
			{form.error}
		</Alert>
	{/if}
</form>
