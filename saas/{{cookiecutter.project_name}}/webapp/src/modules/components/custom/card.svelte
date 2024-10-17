<script lang="ts">
	import { Root, Content, Header, Footer } from '@/components/ui/card';
</script>

<Root>
	{#if $$slots.header}
		<Header>
			<slot name="header" />
		</Header>
	{/if}

	<Content>
		<slot />
	</Content>

	{#if $$slots.footer}
		<Footer>
			<slot name="footer"></slot>
		</Footer>
	{/if}
</Root>
