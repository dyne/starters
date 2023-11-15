<script>
	import { A } from 'flowbite-svelte';
	import LL from '$i18n/i18n-svelte';
</script>

<div class="flex flex-col p-4">
	<A href="/my/profile">{$LL.MY_PROFILE()}</A>
	<A href="/my/organizations">{$LL.MY_ORGANIZATIONS()}</A>
</div>
