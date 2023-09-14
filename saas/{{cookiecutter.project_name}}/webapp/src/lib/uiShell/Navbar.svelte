<script lang="ts">
	import { Navbar } from 'flowbite-svelte';
	let navDivClass =
		'bg-white text-gray-500 border-gray-200 divide-gray-200 flex items-center justify-between w-full lg:mx-auto py-0 px-4';
</script>

<Navbar
	fluid={true}
	navClass="px-2 sm:px-4 py-1.5 fixed w-full z-20 top-0 left-0 border-b"
	{navDivClass}
>
	<slot name="start">
		<div />
	</slot>
	<slot name="center">
		<div />
	</slot>
	<slot name="end">
		<div />
	</slot>
</Navbar>
