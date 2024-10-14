<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { getFormContext } from '@/forms';

	const { superform } = getFormContext();
	const { allErrors } = superform;
</script>

<Form.Button disabled={$allErrors.length > 0}>
	<slot></slot>
</Form.Button>
