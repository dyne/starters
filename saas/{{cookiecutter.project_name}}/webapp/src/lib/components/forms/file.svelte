<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';

	import { Fileupload, Helper, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';
	import FieldError, { fieldHasErrors } from './fieldParts/fieldError.svelte';
	import FieldLabel from './fieldParts/fieldLabel.svelte';
	import ListgroupItemButton from '../listgroupItemButton.svelte';

	//

	export let field: string;
	export let label = '';
	export let multiple = false;
	export let accept: string[] = [];
	export let required = false;

	const { superform } = getFormContext();
	const { validate } = superform;
	const { value, errors } = formFieldProxy(superform, field);

	//

	$: hasErrors = fieldHasErrors($errors);

	const oldFiles: File[] = [].concat($value);

	//

	async function handleFileSelect(e: Event) {
		const fileList = (e.target as HTMLInputElement)?.files;
		if (!fileList) return;

		let data = !multiple ? fileList[0] : [...($value as File[]), ...fileList];
		await handleChange(data);
	}

	//

	function isFileArray(value: unknown): value is File[] {
		return Array.isArray(value) && value.every((item) => item instanceof File);
	}

	function isFile(value: unknown): value is File {
		return Boolean(value) && value instanceof File;
	}

	function removeFile() {
		if (!isFile($value)) return;
		handleChange($value);
	}

	function removeFileFromArray(file: File) {
		if (!isFileArray($value)) return;
		handleChange($value.filter((item) => item !== file));
	}

	//

	let rejectedFiles: { file: File; errors: string[] }[] = [];

	async function handleChange(data: File | File[]) {
		rejectedFiles = [];

		const errors = await validate(field, { value: data, update: false });

		if (!errors) {
			await validate(field, { value: data, taint: true });
			return;
		}

		if (!multiple && data instanceof File) {
			rejectedFiles = [{ file: data, errors }];
		}

		if (multiple && Array.isArray(data)) {
			const errorsRecord = errors as unknown as Record<string, string[]>;
			const rejectedFilesIndexes = Object.keys(errorsRecord).map((key) => Number(key));

			for (const index of rejectedFilesIndexes) {
				rejectedFiles = [
					...rejectedFiles,
					{
						file: data[index],
						errors: errorsRecord[index]
					}
				];
			}

			data = data.filter((_, index) => !rejectedFilesIndexes.includes(index));
			await validate(field, { value: data, taint: true });
		}
	}
</script>

<div class="space-y-3">
	<FieldLabel {field} text={label} />

	<Fileupload
		id={field}
		name={field}
		{multiple}
		{required}
		accept={accept.join(', ')}
		data-invalid={hasErrors}
		on:change={handleFileSelect}
	/>

	{#if isFile($value) || (isFileArray($value) && $value.length > 0)}
		<div>
			<Helper>FILES</Helper>
			<Listgroup>
				{#if !multiple && isFile($value)}
					<ListgroupItemButton on:click={removeFile}>
						{$value.name}
					</ListgroupItemButton>
				{/if}

				{#if multiple && isFileArray($value)}
					{#each $value as file}
						<ListgroupItemButton
							on:click={() => {
								removeFileFromArray(file);
							}}
						>
							{file.name}
						</ListgroupItemButton>
					{/each}
				{/if}
			</Listgroup>
		</div>
	{/if}

	<FieldError {field} />

	{#if rejectedFiles.length > 0}
		<div class="space-y-1">
			<Helper>REJECTED FILES</Helper>
			<Listgroup>
				{#each rejectedFiles as { file, errors }}
					<ListgroupItem>
						<div>
							{file.name}
						</div>
						<div>
							{#each errors as error}
								<Helper color="red">{error}</Helper>
							{/each}
						</div>
					</ListgroupItem>
				{/each}
			</Listgroup>
		</div>
	{/if}
</div>
