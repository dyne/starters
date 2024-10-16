<script lang="ts">
	export let tag: 'h1' | 'h2' | 'h3' | 'p' | 'small' = 'p';

	let className: string | undefined = undefined;
	export { className as class };
</script>

{#if tag == 'h1'}
	<h1 class={className}><slot /></h1>
{:else if tag == 'h2'}
	<h2 class={className}><slot /></h2>
{:else if tag == 'h3'}
	<h3 class={className}><slot /></h3>
{:else if tag == 'p'}
	<p class={className}><slot /></p>
{:else if tag == 'small'}
	<small class={className}><slot /></small>
{/if}

<style lang="postcss">
	h1 {
		@apply scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl;
	}

	h2 {
		@apply scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0;
	}

	h3 {
		@apply scroll-m-20 text-2xl font-semibold tracking-tight;
	}

	p {
		@apply leading-7 [&:not(:first-child)]:mt-6;
	}

	small {
		@apply text-sm font-medium leading-none;
	}
</style>
