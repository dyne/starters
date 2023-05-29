<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
	import { Alert } from 'flowbite-svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<form
	method="POST"
	class="card"
	use:enhance={() => {
		return async ({ result }) => {
			pb.authStore.loadFromCookie(document.cookie);
			await applyAction(result);
		};
	}}
>
	<h1>Log in</h1>

	<input type="email" name="email" placeholder="Email" />
	<input type="password" name="password" placeholder="Password" />
	<button>Log in</button>
	{#if form?.error}
		<Alert dismissable={false} accent={false} color="red">
			{form.error}
		</Alert>
	{/if}
</form>
