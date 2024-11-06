<script lang="ts">
	import { formFieldProxy, type FormPath } from 'sveltekit-superforms';
	import { getFormContext } from '../form.svelte';
	import type { GenericRecord } from '@/utils/types';

	interface Props {
		field: string;
	}

	let { field }: Props = $props();

	const { hideRequiredIndicator, form } = getFormContext();
	const { constraints } = formFieldProxy(form, field as FormPath<GenericRecord>);
	let isFieldRequired = $derived($constraints?.required);
</script>

{#if !hideRequiredIndicator && isFieldRequired}
	<span class="text-destructive ml-1 font-bold">*</span>
{/if}
