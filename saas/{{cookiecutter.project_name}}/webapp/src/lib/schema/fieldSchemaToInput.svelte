<script lang="ts">
	import Checkbox from '$lib/components/forms/checkbox.svelte';
	import File from '$lib/components/forms/file.svelte';
	import Input from '$lib/components/forms/input.svelte';
	import Select from '$lib/components/forms/select.svelte';
	import Textarea from '$lib/components/forms/textarea.svelte';
	import { type FieldSchema, FieldType } from './types';

	export let fieldSchema: FieldSchema;

	const field = fieldSchema.name;
	const label = fieldSchema.name;

	let options: string[] = [];
	if (fieldSchema.type == FieldType.SELECT) {
		options = fieldSchema.options.values as string[];
	}

	let fileConstraints = {};
	if (fieldSchema.type == FieldType.FILE) {
		fileConstraints = {
			accept: (fieldSchema.options.mimeTypes as string[]).join(', '),
			multiple: fieldSchema.options.maxSelect != 1
		};
	}
</script>

{#if fieldSchema.type == FieldType.TEXT}
	<Input {field} {label} />
{:else if fieldSchema.type == FieldType.BOOL}
	<Checkbox {field}>{label}</Checkbox>
{:else if fieldSchema.type == FieldType.FILE}
	<File {field} {label} constraints={fileConstraints} />
{:else if fieldSchema.type == FieldType.SELECT}
	<Select {field} {label} {options} />
{:else if fieldSchema.type == FieldType.EDITOR}
	<Textarea {field} {label} />
{/if}
