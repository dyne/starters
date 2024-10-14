import { describe, it, expect } from 'vitest';
import { createCollectionZodSchema } from '.';
import type { CollectionFormData } from '@/pocketbase/types';

//

describe('generated collection zod schema', () => {
	const schema = createCollectionZodSchema('z_test_collection');

	it('fails the validation for empty object ', () => {
		const parseResult = schema.safeParse({});
		expect(parseResult.success).toBe(false);
	});

	const baseData: CollectionFormData<'z_test_collection'> = {
		number_field: 3,
		relation_field: 'generic-id',
		text_field: 'sampletext',
		relation_multi_field: ['id-1', 'id-2'],
		richtext_field: '<div></div>',
		file_field: dummyFile()
	};

	it('passes the validation for typed object', () => {
		const parseResult = schema.safeParse(baseData);
		expect(parseResult.success).toBe(true);
	});

	it('fails the validation for file with bad mimeType', () => {
		const data: CollectionFormData<'z_test_collection'> = {
			...baseData,
			file_field: dummyFile('text/json')
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
		expect(parseResult.error?.issues.length).toBe(1);
		const parseErrorPath = parseResult.error?.issues.at(0)?.path.at(0);
		expect(parseErrorPath).toBe('file_field');
	});

	it('accepts empty string for optional url', () => {
		const data: CollectionFormData<'z_test_collection'> = {
			...baseData,
			url_field: ''
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(true);
	});

	it('doesn`t accept url with bad domain', () => {
		const data: CollectionFormData<'z_test_collection'> = {
			...baseData,
			url_field: 'https://miao.com'
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
		const parseErrorPath = parseResult.error?.issues.at(0)?.path.at(0);
		expect(parseErrorPath).toBe('url_field');
	});

	it('fails the regex test', () => {
		const data: CollectionFormData<'z_test_collection'> = {
			...baseData,
			text_field: 'abc 123'
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
	});
});

function dummyFile(mime = 'text/plain') {
	return new File(['Hello, World!'], 'hello.txt', {
		type: mime,
		lastModified: Date.now()
	});
}
