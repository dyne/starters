<script lang="ts" context="module">
	import { getContext } from 'svelte';
	import { type SuperForm } from 'sveltekit-superforms/client';
	import type { GenericRecord } from '@/utils/types';

	//

	export const FORM_KEY = Symbol('form');

	export type FormContext<T extends GenericRecord> = {
		superform: SuperForm<T>;
		showRequiredIndicator: boolean;
	};

	export function getFormContext<T extends GenericRecord>(): FormContext<T> {
		return getContext(FORM_KEY);
	}
</script>

<script lang="ts" generics="T extends GenericRecord">
	import { setContext } from 'svelte';
	import { Spinner, Modal } from 'flowbite-svelte';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';

	//

	export let form: SuperForm<T, any>;
	export let showRequiredIndicator = false;

	let className = 'space-y-8';
	export { className as class };

	//

	$: enctype = form.options.dataType == 'form' ? 'multipart/form-data' : undefined;

	const { enhance, delayed } = form;
	setContext<FormContext<T>>(FORM_KEY, { superform: form, showRequiredIndicator });
</script>

<form class={className} method="post" use:enhance {enctype}>
	<slot />
</form>

{#if $delayed}
	<PortalWrapper>
		<Modal open={$delayed} dismissable={false}>
			<Spinner />
		</Modal>
	</PortalWrapper>
{/if}
