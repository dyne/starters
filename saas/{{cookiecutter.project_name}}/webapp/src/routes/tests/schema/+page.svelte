<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { ZTestCollectionRecord } from '@/pocketbase/types';
	import { createCollectionZodSchema } from '@/pocketbase/zod-schema';
	import type { CollectionTypeWithFile } from '@/pocketbase/collections-config/pb-schema-to-zod/types';
	import { z } from 'zod';

	const x = z
		.object({
			x: z.string(),
			y: z.record(z.unknown())
		})
		.extend({
			y: z.object({
				u: z.number()
			})
		});

	const u = x.parse({});

	const res = pb.collection('z_test_collection').getFullList();

	async function routine() {
		const data: CollectionTypeWithFile<'z_test_collection'> = {
			file_field: dummyFile(),
			richtext_field: 'AO',
			text_field: 'Miao',
			relation_multi_field: ['sqynj66ubxkl32s', '2yqpdt4p0h3o7s9'],
			relation_field: 'sqynj66ubxkl32s',
			number_field: 21,
			json_field: { ao: 4 }
		};
		const schema = createCollectionZodSchema('z_test_collection');
		const parsedData = schema.safeParse(data);
		console.log(parsedData);
		if (parsedData.success == true)
			await pb.collection('z_test_collection').create(parsedData.data);
	}
	routine();

	function dummyFile() {
		return new File(['Hello, World!'], 'hello.txt', {
			type: 'text/plain',
			lastModified: Date.now()
		});
	}
</script>

{#await res then x}
	<pre>{JSON.stringify(x, null, 2)}</pre>
{/await}
