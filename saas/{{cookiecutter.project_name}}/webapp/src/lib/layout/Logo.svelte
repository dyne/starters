<script>
	import LL from '$i18n/i18n-svelte';
	import { appTitle } from '$lib/strings';
	import { NavBrand } from 'flowbite-svelte';

	/*
	 * The url to navigate to when the logo is clicked.
	 */
	export let href = $LL.LINK('/my');
</script>

<NavBrand {href}>
	<img src={'/logo.svg'} class="h-9" alt={appTitle} />
</NavBrand>

<!--  
    @component 
    Simple logo component. Change logo.svg to your logo.

    ### Props
    - `href` - The url to navigate to when the logo is clicked.
-->
