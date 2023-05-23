<script lang="ts">
	import { userQuestions } from '$lib/auth/userQuestions';
	import { Input, Label } from 'flowbite-svelte';
</script>

{#each Object.entries(userQuestions) as [key, question]}
	<Label class="space-y-2">
		<span>{question}</span>
		<Input type="text" name={key} />
	</Label>
{/each}
