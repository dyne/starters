<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import * as slangroom from '$lib/slangroom';
	import { Tabs, TabItem, Spinner, Heading } from 'flowbite-svelte';
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
		(key) => key !== 'authWithPassword' && key !== 'updateProfile' && key !== 'organizationServices'
	);
	type Keys = (typeof slangroomKeys)[number];
	const userId = $currentUser?.id;

	const showSlangroomResult = async (key: Keys, id = userId) => {
		const token = getToken();
		console.log(key, token, userId);
		//@ts-ignore
		results = await slangroom[key]({ id, token });
		console.log(results);
	};
</script>

<div class="max-w-3xl mx-auto p-4">
	<Heading class="my-4">Slangroom api</Heading>
	<Tabs
		style="full"
		defaultClass="flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700"
	>
		{#each slangroomKeys as k}
			<TabItem open on:click={() => showSlangroomResult(k)}>
				<span slot="title">{k}</span>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					<b class="mb-12">{k}</b>
					{#await showSlangroomResult}
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
</div>
