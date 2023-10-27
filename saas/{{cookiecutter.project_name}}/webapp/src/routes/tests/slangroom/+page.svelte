<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import * as slangroom from '$lib/slangroom';
	import { Tabs, TabItem, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let ls: any = null;
	let pocketbaseAuth = `Cannot read "pocketbase_auth".`;
	let results: any;

	const read = () => !!ls && ls.getItem(`pocketbase_auth`);
	const getToken = () => JSON.parse(pocketbaseAuth).token;

	onMount(() => {
		typeof localStorage !== `undefined` && (ls = localStorage);
		pocketbaseAuth = read();
	});

	const slangroomKeys = Object.keys(slangroom).filter(
		(key) => key !== 'authWithPassword' && key !== 'updateProfile'
	);
	type Keys = typeof slangroomKeys[number];
	const userId = pb.authStore.model?.id;

	const showSlanroomResult = async (key: Keys) => {
		const token = getToken();
		console.log(key,token, userId)
		//@ts-ignore
		results = await slangroom[key]({ userId, token });
	};
</script>

<Tabs
	style="full"
	defaultClass="flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700"
>
	{#each slangroomKeys as k}
		<TabItem open>
			<button slot="title" on:click={()=>showSlanroomResult(k)}>{k}</button>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>{k}</b>
				{#await showSlanroomResult}
					<Spinner />
				{:then}
					<pre>
					{JSON.stringify(results, null, 2)}
				</pre>
				{:catch}
					error
				{/await}
			</p>
		</TabItem>
	{/each}
</Tabs>
