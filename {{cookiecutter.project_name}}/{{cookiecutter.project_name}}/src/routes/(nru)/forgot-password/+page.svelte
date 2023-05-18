<script lang="ts">
	import { Label, Input } from 'flowbite-svelte';
	const onSubmit = (e: Event) => {
		const formData = new FormData(e.target as HTMLFormElement);

		const data: Record<string, string | File> = {};
		for (const field of formData.entries()) {
			const [key, value] = field;
			data[key] = value;
		}
		console.log(data);
	};
</script>

<form on:submit={onSubmit}>
	<Label for="email" class="mb-2">Your email</Label>
	<Input type="email" name="email" id="email" placeholder="name@company.com" required />
</form>
