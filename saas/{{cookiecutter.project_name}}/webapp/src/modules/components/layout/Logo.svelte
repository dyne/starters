<script lang="ts">
	import { appTitle } from '@/utils/strings';

	interface Props {
		/*
		 * The url to navigate to when the logo is clicked.
		 */
		href?: string;
	}

	let { href = '/my' }: Props = $props();
</script>

<a {href}>
	<img src={'/logo.svg'} class="h-9" alt={appTitle} />
</a>

<!--  
    @component 
    Simple logo component. Change logo.svg to your logo.

    ### Props
    - `href` - The url to navigate to when the logo is clicked.
-->
