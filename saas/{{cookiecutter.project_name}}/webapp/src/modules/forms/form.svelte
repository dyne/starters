<script lang="ts" module>
	import { getContext, setContext, type Snippet } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { GenericRecord } from '@/utils/types';
	import { setupDerivedContext } from '@/utils/context.svelte';

	//

	export const FORM_KEY = Symbol('ok');

	export type FormContext<Data extends GenericRecord = GenericRecord> = {
		form: SuperForm<Data>;
		hideRequiredIndicator: boolean;
	};

	const { getDerivedContext: getFormContext, setDerivedContext: setFormContext } =
		setupDerivedContext<FormContext>('form');

	export { getFormContext };
</script>

<script lang="ts" generics="T extends GenericRecord">
	import { m } from '@/i18n';
	import FormError from './components/formError.svelte';
	import SubmitButton from './components/submitButton.svelte';
	import LoadingDialog from '@/components/custom/loadingDialog.svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

	//

	type FormSnippets = {
		submitButtonContent?: Snippet;
		submitButton?: Snippet<[{ SubmitButton: typeof SubmitButton }]>;
		loadingStateContent?: Snippet;
		loadingState?: Snippet<[{ isLoading: boolean }]>;
	};

	type Props = {
		form: SuperForm<T, any>;
		hide?: ('error' | 'submit_button' | 'loading_state' | 'required_indicator')[];
		children?: Snippet<
			[{ SubmitButton: typeof SubmitButton; FormError: typeof FormError; isLoading: boolean }]
		>;
	} & FormSnippets &
		HTMLFormAttributes;

	const {
		form,
		hide = [],
		class: className = 'space-y-6',
		children,
		submitButton,
		submitButtonContent,
		loadingState,
		loadingStateContent,
		...rest
	}: Props = $props();

	//

	type Enctype = HTMLFormAttributes['enctype'];
	const enctype: Enctype = $derived(
		form.options.dataType == 'form' ? 'multipart/form-data' : undefined
	);

	const { enhance, delayed } = $derived(form);

	//

	const context = $derived<FormContext<T>>({
		form,
		hideRequiredIndicator: hide.includes('required_indicator')
	});

	setFormContext(() => context);
</script>

<form {...rest} class={className} method="post" use:enhance {enctype}>
	{@render children?.({ FormError, SubmitButton, isLoading: $delayed })}

	{#if !hide.includes('error')}
		<FormError></FormError>
	{/if}

	{#if submitButton}
		{@render submitButton({ SubmitButton })}
	{:else if !hide.includes('submit_button')}
		<div class="flex justify-end">
			<SubmitButton>
				{#if submitButtonContent}
					{@render submitButtonContent()}
				{:else}
					{m.Submit()}
				{/if}
			</SubmitButton>
		</div>
	{/if}
</form>

{#if loadingState}
	{@render loadingState({ isLoading: $delayed })}
{:else if !hide.includes('loading_state')}
	<LoadingDialog loading={$delayed}>
		{#if loadingStateContent}
			{@render loadingStateContent()}
		{:else}
			{m.Please_wait()}
		{/if}
	</LoadingDialog>
{/if}
