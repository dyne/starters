<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { getFormContext } from '@/forms';
	import { FORM_ERROR_PATH } from '../form';

	const { form } = getFormContext();
	const { allErrors } = form;

	$: formHasErrors = $allErrors.filter((e) => e.path != FORM_ERROR_PATH).length > 0;
</script>

<Form.Button disabled={formHasErrors}>
	<slot></slot>
</Form.Button>
