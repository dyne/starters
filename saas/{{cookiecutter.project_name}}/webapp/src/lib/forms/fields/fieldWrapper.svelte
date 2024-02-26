<script lang="ts" generics="T extends Record<string, unknown>">
	import { Control, Description, Field, FieldErrors, Label } from 'formsnap';
	import type { SuperForm, FormPath } from 'sveltekit-superforms';
	import FieldRequiredIndicator from './requiredIndicator.svelte';

	export let form: SuperForm<T>;
	export let field: FormPath<T>;

	export let label: string | undefined = undefined;
	export let description: string | undefined = undefined;
</script>

<div class="space-y-2">
	<Field {form} name={field}>
		<Control let:attrs>
			{#if label}
				<div class="text-sm">
					<Label>{label ?? field} <FieldRequiredIndicator {attrs} /></Label>
				</div>
			{/if}
			<slot {attrs} />
		</Control>
		{#if description}
			<div class="text-xs text-gray-400">
				<Description>{description}</Description>
			</div>
		{/if}
		<FieldErrors />
	</Field>
</div>
