<script lang="ts">
	import { Navbar } from 'flowbite-svelte';
</script>

<div class="shrink-0 border-b-2">
	<Navbar fluid classNavDiv="!flex-nowrap">
		<div>
			<slot name="left" />
		</div>
		<div>
			<slot name="center" />
		</div>
		<div>
			<slot name="right" />
		</div>
	</Navbar>
</div>

<!-- 
	@component 

	### Slots
	- left - the left side of the navbar
	- center - the center of the navbar
	- right - the right side of the navbar
	
-->
