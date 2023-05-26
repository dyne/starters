<script lang="ts">
	import { appTitle } from '$lib/strings';
	import PocketBase from 'pocketbase';

	const handleClick = async () => {
		const pb = new PocketBase('http://127.0.0.1:8090');
		let didDiv = document.getElementById("currentDid");
		let statusDiv = document.getElementById("didStatus");
		const res = await pb.send("/api/did");
		console.log(res);
		statusDiv.innerHTML = res.created ? "CREATO" : "LETTO";
		didDiv.innerHTML = JSON.stringify(res.did);
	}
</script>

<h1>{appTitle} dashboard</h1>

<button on:click|once={handleClick} class="border-solid  p-2 bg-gray-300">
	Create DID
</button>
<div id="didStatus">
</div>
<div id="currentDid">
</div>

