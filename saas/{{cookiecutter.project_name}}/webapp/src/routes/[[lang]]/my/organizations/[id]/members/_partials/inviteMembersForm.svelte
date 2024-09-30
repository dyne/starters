<script lang="ts">
	import Icon from '$lib/components/icon.svelte';
	import { createForm, Form, Textarea } from '$lib/forms';
	import FieldHelpText from '$lib/forms/fields/fieldParts/fieldHelpText.svelte';
	import SubmitButton from '$lib/forms/submitButton.svelte';
	import { m } from '$lib/i18n';
	import { readFileAsString } from '$lib/utils/files';
	import { Array, pipe } from 'effect';
	import { Alert, Button, Label } from 'flowbite-svelte';
	import { ArrowRight } from 'svelte-heros-v2';
	import { z } from 'zod';

	//

	export let onSuccess = () => {};
	export let onClose = () => {};

	//

	function extractEmailsFromText(text: string): string[] {
		const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
		const emails = text.match(emailRegex);
		return emails || [];
	}

	/* */

	let emails: string[] = [];

	/* Text field handling */

	let textValue: string | undefined = undefined;
	$: if (textValue) handleTextValueChange(textValue);

	function handleTextValueChange(text: string) {
		emails.push(...extractEmailsFromText(text));
		emails = Array.dedupe(emails);
	}

	/* File upload handling */

	let fileList: FileList | undefined = undefined;
	$: if (fileList) handleFileUpload(fileList);

	async function handleFileUpload(fileList: FileList) {
		const file = fileList.item(0);
		if (!file) return;
		const fileContent = await readFileAsString(file);
		handleTextValueChange(fileContent);
	}

	const acceptedFiles: Record<string, string | string[]> = {
		'Plain text': 'text/plain',
		CSV: 'text/csv',
		Markdown: 'text/markdown',
		XML: ['application/xml', 'text/xml'],
		JSON: 'application/json'
	};

	const acceptedFilesNames = Object.keys(acceptedFiles).join(', ');
	const mimeTypes = Object.values(acceptedFiles).flat().join(', ');
</script>

<div class="space-y-6">
	<div class="space-y-2">
		<Label for="file">{m.Upload_a_file_containing_emails()}</Label>
		<input
			name="file"
			type="file"
			class="w-full rounded-lg border"
			accept={mimeTypes}
			bind:files={fileList}
		/>
		<FieldHelpText text="{m.accepted_files()}: {acceptedFilesNames}" />
	</div>

	<div class="flex items-center gap-4">
		<hr class="grow basis-1" />
		<p>{m.and()} / {m.or()}</p>
		<hr class="grow basis-1" />
	</div>

	<div class="space-y-2">
		<Label for="file">{m.Paste_email_addresses_here()}</Label>
		<textarea
			bind:value={textValue}
			class="hover:border-primary-500 h-[150px] max-h-[150px] w-full resize-none rounded-lg border border-gray-200 focus:border-gray-200"
		/>
	</div>

	{#if emails.length}
		<div class="flex justify-end gap-2">
			<Alert color="green">
				<div>
					<p>{m.Emails_found_You_can_proceed_to_the_next_step()}</p>
					<Button>
						<Icon src={ArrowRight} mr></Icon>
						{m.Next()}
					</Button>
				</div>
			</Alert>
		</div>
	{/if}
</div>
