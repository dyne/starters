<script lang="ts">
	import { page } from '$app/stores';
	import { m } from '@/i18n';
	import T from '@/components/custom/t.svelte';
	const status = $page.status;
	const title = status === 404 ? 'Not Found' : 'Internal Error';
	const image = status === 404 ? '/404-computer.svg' : '/500.svg';
	const message = $page.error?.message;
</script>

<div
	class="mx-auto flex min-h-screen max-w-4xl flex-col gap-4 p-8 pt-20 lg:flex-row lg:p-0 lg:pt-0"
>
	<div class="flex w-full flex-col items-center justify-center">
		<img src={image} alt={title} />
	</div>
	<div class="flex w-full flex-col items-center justify-center gap-4">
		<T tag="h3" class="text-primary-600">{status} {title}</T>
		<T tag="h2">{message}</T>
		<div class="w-full pt-8">
			<T class="text-gray-400">{m.Here_are_some_Helpful_link()}</T>
			<ul class="flex gap-2">
				<li><a href="/">{m.Home()}</a></li>
				<li><a href="/login">{m.Login()}</a></li>
				<li><a href="/register">{m.Register()}</a></li>
				<li><a href="/my">{m.My()}</a></li>
			</ul>
		</div>
	</div>
</div>
