<script lang="ts">
	import { Navbar } from 'flowbite-svelte';
</script>

<div class="shrink-0 border-b-2">
	<Navbar fluid={true}>
		<slot name="left">
			<div />
		</slot>
		<slot name="center">
			<div />
		</slot>
		<slot name="right">
			<div />
		</slot>
	</Navbar>
</div>

<!-- 
	@component 

	### Slots
	- left - the left side of the navbar
	- center - the center of the navbar
	- right - the right side of the navbar
	
-->
