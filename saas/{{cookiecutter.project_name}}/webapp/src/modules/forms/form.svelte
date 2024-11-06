<script lang="ts" module>
	import { getContext } from 'svelte';
	import { type SuperForm } from 'sveltekit-superforms/client';
	import type { GenericRecord } from '@/utils/types';

	//

	export const FORM_KEY = Symbol('form');

	export type FormContext<Data extends GenericRecord> = {
		form: SuperForm<Data>;
		hideRequiredIndicator: boolean;
	};

	export function getFormContext<Data extends GenericRecord>(): FormContext<Data> {
		return getContext(FORM_KEY);
	}
</script>

<script lang="ts" generics="T extends GenericRecord">
	import { run } from 'svelte/legacy';

	import { m } from '@/i18n';

	import { setContext } from 'svelte';
	import FormError from './components/formError.svelte';
	import SubmitButton from './components/submitButton.svelte';
	import LoadingDialog from '@/components/custom/loadingDialog.svelte';

	


	interface Props {
		//
		form: SuperForm<T, any>;
		hideRequiredIndicator?: boolean;
		loadingText?: string | undefined;
		submitButtonText?: string | undefined;
		hide?: ('error' | 'submitButton' | 'loading')[];
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		form,
		hideRequiredIndicator = false,
		loadingText = m.Please_wait(),
		submitButtonText = m.Submit(),
		hide = [],
		class: className = 'space-y-6',
		children
	}: Props = $props();
	

	//

	type Enctype =
		| 'text/plain'
		| 'application/x-www-form-urlencoded'
		| 'multipart/form-data'
		| null
		| undefined;

	let enctype: Enctype = $state(undefined);
	run(() => {
		enctype = form.options.dataType == 'form' ? 'multipart/form-data' : undefined;
	});

	//

	const { enhance, delayed } = form;
	setContext<FormContext<T>>(FORM_KEY, { form, hideRequiredIndicator });
</script>

<form class={className} method="post" use:enhance {enctype}>
	{@render children?.()}

	{#if !hide.includes('error')}
		<FormError></FormError>
	{/if}

	{#if !hide.includes('submitButton')}
		<div class="flex justify-end">
			<SubmitButton>
				{submitButtonText}
			</SubmitButton>
		</div>
	{/if}
</form>

{#if !hide.includes('loading')}
	<LoadingDialog loading={$delayed}>
		{loadingText}
	</LoadingDialog>
{/if}
