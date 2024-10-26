<script lang="ts">
	import CopyButton from '$lib/components/copyButton.svelte';
	import { capitalizeFirstLetter } from '$lib/utils/strings';
	import type { PublicKeys } from '@/keypairoom/utils';
	import Button from '@/components/ui/button/button.svelte';
	import T from '@/components/custom/t.svelte';
	import { m } from '$lib/i18n';
	import Separator from '@/components/ui/separator/separator.svelte';

	export let keys: PublicKeys | undefined = undefined;
</script>

<T tag="h4">{m.Your_keys()}</T>
<Separator class="my-4"></Separator>

{#if keys}
	<div class="flex flex-col gap-4">
		{#each Object.entries(keys) as [keyName, key]}
			{@const title = capitalizeFirstLetter(keyName.replaceAll('_', ' '))}
			<div class="flex w-full flex-row items-center justify-between gap-4">
				<div class="w-0 grow overflow-hidden">
					<T class="font-medium">{title}</T>
					<T class="overflow-hidden text-ellipsis">{key}</T>
				</div>
				<div class="shrink-0">
					<CopyButton textToCopy={key} />
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="flex justify-between">
		<T tag="p">{m.You_have_no_keys_yet()}</T>
		<Button color="primary" size="sm" href="/keypairoom">{m.Generate_keyring()}</Button>
	</div>
{/if}
