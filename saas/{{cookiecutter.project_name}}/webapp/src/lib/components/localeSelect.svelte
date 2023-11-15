<script lang="ts">
	import LocaleOptions from '$i18n/components/localeOptions.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import type { Locales } from '$i18n/i18n-types';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';

	const localesIcons: Record<Locales, string> = {
		en: '🇬🇧',
		it: '🇮🇹'
	};

	const triggerId = 'locale-button';
</script>

<Button class="!p-0 !w-10 !h-10 !text-2xl" color="alternative" id={triggerId}>
	{localesIcons[$locale]}
</Button>
<Dropdown triggeredBy={`#${triggerId}`}>
	<LocaleOptions let:option>
		<DropdownItem class="!text-2xl" href={option.href} data-sveltekit-preload-data="off">
			{localesIcons[option.locale]}
		</DropdownItem>
	</LocaleOptions>
</Dropdown>
