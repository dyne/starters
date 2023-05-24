<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
	import type { ActionData } from './$types';
	import { A, Alert, Button, Heading, Hr, Input, Label, P } from 'flowbite-svelte';
	import UserQuestions from '$lib/components/userQuestions.svelte';

	export let form: ActionData;
</script>

{#if !form?.seed}
	<form
		method="POST"
		class="flex flex-col space-y-6 bg-white mx-auto max-w-md p-6 rounded-md shadow-md dark:bg-gray-800 dark:text-white"
		use:enhance={() => {
			return async ({ result }) => {
				pb.authStore.loadFromCookie(document.cookie);
				await applyAction(result);
			};
		}}
	>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Generate your keys</h3>

		<Alert dismissable={false} accent={false}>
			<span slot="icon"
				><svg
					aria-hidden="true"
					class="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/></svg
				>
			</span>
			<span class="sr-only">Info</span>
			<span class="font-bold">Important information</span>
			<ul slot="extra" class="mt-0 ml-8 list-disc pl-4 space-y-1 pt-1">
				<li>
					By answering these questions, you will generate keys that will be used to encrypt your
					data.
				</li>
				<li>Please remember the answers, as they will be the only way to restore the keys.</li>
				<li>Please answer at least 3 of the following questions.</li>
			</ul>
		</Alert>

		<UserQuestions />
		<Hr />

		<Button type="submit">Create keys</Button>

		{#if form?.error}
			<pre class="bg-red-100">{JSON.stringify(form, null, 2)}</pre>
		{/if}
	</form>
{:else}
	<Heading tag="h4">Registration successful!</Heading>
	<P size="sm" color="text-gray-400 dark:text-gray-600">
		Please write down your seed and keep it safe. You will need it to login.
	</P>
	<div class="p-4 bg-primary-300 rounded-md">
		<P size="sm" color="text-primary-800">
			{form.seed}
		</P>
	</div>
	<Hr />
	<P size="sm" align="center">
		<A href="/login">Login here</A>
	</P>
{/if}
