<script lang="ts" context="module">
	import { normalizeError } from '$lib/errorHandling';
	import type { AnyZodObject, ZodEffects } from 'zod';
	import {
		superForm,
		setMessage,
		setError,
		type FormOptions,
		type SuperForm,
		defaults
	} from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { Infer } from 'sveltekit-superforms';
	import type { BaseRecord } from '$lib/utils/types';

	//

	export type SubmitFunction<R extends BaseRecord> = NonNullable<
		FormOptions<R, unknown>['onUpdate']
	>;

	export function createForm<T extends AnyZodObject>(
		schema: T | ZodEffects<T>,
		onSubmit: SubmitFunction<Infer<T>> = async () => {},
		initialData: Partial<Infer<T>> | undefined = undefined,
		options: FormOptions<Infer<T>, unknown> = {}
	) {
		return superForm(defaults(initialData, zod(schema)), {
			SPA: true,
			applyAction: false,
			scrollToError: 'smooth',
			validators: zod(schema),
			onUpdate: async (input) => {
				const { form } = input;
				try {
					if (form.valid) await onSubmit(input);
				} catch (e) {
					let error = normalizeError(e);
					for (const [key, value] of Object.entries(error.data)) {
						// @ts-ignore
						if (Boolean(form.data[key])) {
							setError(form, key as any, value.message);
							delete error.data[key];
						}
					}
					setMessage(form, error);
				}
			},
			...options
		});
	}

	type SuperFormAllErrors = {
		path: string;
		messages: string[];
	}[];

	export function formHasErrors(allErrors: SuperFormAllErrors): boolean {
		const checks: boolean[] = [];
		if (allErrors.length === 0) return false;
		else {
			for (const error of allErrors) {
				if (error.messages.length > 0) checks.push(true);
				// if (typeof value === 'object') checks.push(formHasErrors(value));
				// else if (Boolean(value)) checks.push(true);
			}
		}
		return checks.some((check) => check);
	}

	//

	export function createFormData(data: Record<string, unknown>) {
		const formData = new FormData();
		for (const [key, value] of Object.entries(data)) {
			if (value === null || value === undefined) {
				// Needed otherwise pb complains about "bad formatting", especially for null files
				formData.append(key, '');
			} else if (Array.isArray(value)) {
				// Special case for empty arrays, cause they can't be represented in formData
				if (value.length === 0) {
					formData.append(key, '');
				} else {
					for (const item of value) {
						formData.append(key, item);
					}
				}
			} else {
				formData.append(key, value as string | File);
			}
		}
		return formData;
	}
</script>

<script lang="ts" generics="R extends BaseRecord">
	import { Spinner, Modal } from 'flowbite-svelte';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';

	//

	export let form: SuperForm<R>;

	let className = 'space-y-8';
	export { className as class };

	//

	const { enhance, delayed } = form;
	const enctype = form.options.dataType == 'form' ? 'multipart/form-data' : undefined;
</script>

<form class={className} method="post" {enctype} use:enhance>
	<slot />
</form>

{#if $delayed}
	<PortalWrapper>
		<Modal open={$delayed} dismissable={false}>
			<Spinner />
		</Modal>
	</PortalWrapper>
{/if}
