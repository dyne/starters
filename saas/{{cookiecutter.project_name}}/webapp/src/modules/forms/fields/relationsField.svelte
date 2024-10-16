<script context="module" lang="ts">
	import type { GenericRecord } from '@/utils/types';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
</script>

<script lang="ts" generics="Data extends GenericRecord, C extends CollectionName">
	import * as Form from '@/components/ui/form';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import type { FieldOptions } from './types';
	import FieldWrapper from './parts/fieldWrapper.svelte';

	//

	export let form: SuperForm<Data>;
	export let name: FormPath<Data, string | string[]>;
	export let options: Partial<FieldOptions> & { collection: C };

	//

	// const { validate } = superform;
	// const { value } = formFieldProxy(superform, field as string);
	// if (!options.name) options.name = field;

	// $: if (Array.isArray($value) && $value.length > 0) validate(field, $value as any);

	// //

	// function fakeTsParse(x: any): RecordGeneric {
	// 	return x;
	// }
</script>

<Form.Field {form} {name}>
	<FieldWrapper field={name} {options} let:attrs>
		<!-- <slot slot="labelRight" name="labelRight" /> -->
		<!-- <RecordsManager {recordType} {collection} bind:value={$value} options={{ ...options }} let:record>
		<slot record={fakeTsParse(record)}>
			{createRecordLabel(record, options.displayFields)}
		</slot>
	</RecordsManager> -->
	</FieldWrapper>
</Form.Field>
