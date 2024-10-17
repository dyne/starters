<script lang="ts">
	import type { AvatarProps } from 'bits-ui';
	import Avatar from './avatar.svelte';
	import type { UsersResponse } from '@/pocketbase/types';
	import { pb } from '@/pocketbase';
	import { m } from '$lib/i18n';

	type $$Props = AvatarProps & { user: UsersResponse };
	$: props = $$props as $$Props;

	$: src = pb.files.getUrl(props.user, props.user?.avatar);
	$: fallback = props.user.name.slice(0, 2);
</script>

<Avatar {...$$restProps} {src} {fallback} alt="{m.Avatar()} {props.user.name}" />
