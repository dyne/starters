<script>
	import { m } from '@/i18n';
	import Alert from '@/components/custom/alert.svelte';
	import { TriangleAlert } from 'lucide-svelte';
</script>

<Alert color="yellow" icon={TriangleAlert}>
	<div class="space-y-1">
		<p>{m.You_have_been_redirected_here_because_your_private_keys_are_missing_()}</p>
		<p>{m.Before_using_the_app_again_you_need_to_restore_them_()}</p>
	</div>
</Alert>
