<script lang="ts">
	import type { AvatarProps } from 'bits-ui';
	import Avatar from './avatar.svelte';
	import type { UsersResponse } from '@/pocketbase/types';
	import { pb } from '@/pocketbase';
	import { m } from '@/i18n';

	type $$Props = AvatarProps & { user?: UsersResponse };
	interface Props {
		user?: $$Props['user'];
		[key: string]: any
	}

	let { user = pb.authStore.model as UsersResponse, ...rest }: Props = $props();
	if (!user) throw new Error('missing user');

	let src = $derived(pb.files.getUrl(user, user?.avatar));
	let fallback = $derived(user.name.slice(0, 2));
</script>

<Avatar {...rest} {src} {fallback} alt="{m.Avatar()} {user.name}" />
