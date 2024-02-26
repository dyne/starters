<script lang="ts" context="module">
	import type { InfoProps } from './types';
	import type { ComponentProps } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { BaseRecord } from '$lib/utils/types';
	import { Checkbox } from 'flowbite-svelte';

	export type FormCheckboxOptions = Partial<HTMLInputAttributes & ComponentProps<Checkbox>> &
		InfoProps;
</script>

<script lang="ts" generics="R extends BaseRecord">
	import RequiredIndicator from './requiredIndicator.svelte';
	import { Label } from 'formsnap';
	import FieldWrapper from './fieldWrapper.svelte';
	import type { FormPath } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	//

	export let form: SuperForm<R>;
	export let field: FormPath<R>;
	export let options: FormCheckboxOptions = {};

	const { value } = formFieldProxy(form, field);
</script>

<FieldWrapper {form} {field} description={options.description} let:attrs>
	<Label>
		<div class="flex items-center space-x-1">
			<Checkbox bind:checked={$value} value="true" {...options} {...attrs} />
			<div>
				<span><slot>{options.label ?? field}</slot></span>
				<RequiredIndicator {attrs} />
			</div>
		</div>
	</Label>
</FieldWrapper>
