<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
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
		<pre class="bg-red-100">{JSON.stringify(form, null, 2)}</pre>
	{/if}
</form>
