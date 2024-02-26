<script lang="ts" context="module">
	import type { InfoProps } from './types';
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { BaseRecord } from '$lib/utils/types';
	import { Toggle } from 'flowbite-svelte';

	export type FormToggleOptions = Partial<HTMLInputAttributes & ComponentProps<Toggle>> & InfoProps;
</script>

<script lang="ts" generics="R extends BaseRecord">
	import type { FormPath } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { Label } from 'formsnap';
	import RequiredIndicator from './requiredIndicator.svelte';
	import FieldWrapper from './fieldWrapper.svelte';

	export let form: SuperForm<R>;
	export let field: FormPath<R>;
	export let options: FormToggleOptions = {};

	const { value, errors } = formFieldProxy(form, field);
</script>

<FieldWrapper {form} {field} let:attrs>
	<Label>
		<div class="flex items-center">
			<Toggle bind:checked={$value} value="true" data-invalid={$errors} {...options} {...attrs} />
			<div>
				<span><slot>{options.label}</slot></span>
				<RequiredIndicator {attrs} />
			</div>
		</div>
	</Label>
</FieldWrapper>
