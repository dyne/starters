<script lang="ts">
	import type { Record } from 'pocketbase';

	export let value: unknown;
	export let record: Record;
</script>

<div class="bg-gray-200 w-fit py-1 px-2 rounded-full text-xs">
	{value}
</div>
