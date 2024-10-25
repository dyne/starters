import { describe, it, expect } from 'vitest';
import { createCollectionZodSchema } from '.';
import type { CollectionFormData } from '@/pocketbase/types';
import { getCollectionModel } from '@/pocketbase/collections-models';
import { subYears, addYears, differenceInMilliseconds, addMilliseconds } from 'date-fns';

//

describe('generated collection zod schema', () => {
	const schema = createCollectionZodSchema('z_test_collection');

	it('fails the validation for empty object ', () => {
		const parseResult = schema.safeParse({});
		expect(parseResult.success).toBe(false);
	});

	const baseData: CollectionFormData['z_test_collection'] = {
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
		const data: CollectionFormData['z_test_collection'] = {
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
		const data: CollectionFormData['z_test_collection'] = {
			...baseData,
			url_field: ''
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(true);
	});

	it('doesn`t accept url with bad domain', () => {
		const data: CollectionFormData['z_test_collection'] = {
			...baseData,
			url_field: 'https://miao.com'
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
		const parseErrorPath = parseResult.error?.issues.at(0)?.path.at(0);
		expect(parseErrorPath).toBe('url_field');
	});

	it('fails the regex test', () => {
		const data: CollectionFormData['z_test_collection'] = {
			...baseData,
			text_field: 'abc 123'
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
	});

	it('fails the json size check with a large JSON object', () => {
		const jsonMaxSize = getCollectionModel('z_test_collection').schema[12].options.maxSize;
		const data: CollectionFormData['z_test_collection'] = {
			...baseData,
			json_field: generateLargeJSONObject(jsonMaxSize * 1.5)
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
		const parseErrorPath = parseResult.error?.issues.at(0)?.path.at(0);
		expect(parseErrorPath).toBe('json_field');
	});

	it('passes the json size check with a small JSON object', () => {
		const jsonMaxSize = getCollectionModel('z_test_collection').schema[12].options.maxSize;
		const jsonObject = generateLargeJSONObject(jsonMaxSize * 0.5);
		const data: CollectionFormData['z_test_collection'] = {
			...baseData,
			json_field: jsonObject
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(true);
	});

	it('fails the date check with a date earlier than minimum', () => {
		const minDate = getCollectionModel('z_test_collection').schema[6].options.min;
		const earlierDate = subYears(minDate, 10);

		const data: CollectionFormData['z_test_collection'] = {
			...baseData,
			date_field: earlierDate.toISOString()
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
	});

	it('fails the date check with a date later than maximum', () => {
		const maxDate = getCollectionModel('z_test_collection').schema[6].options.max;
		const laterDate = addYears(maxDate, 10);

		const data: CollectionFormData['z_test_collection'] = {
			...baseData,
			date_field: laterDate.toISOString()
		};
		const parseResult = schema.safeParse(data);
		expect(parseResult.success).toBe(false);
	});

	it('passes the date check with a date in between', () => {
		const { min, max } = getCollectionModel('z_test_collection').schema[6].options;
		const difference = differenceInMilliseconds(max, min);
		const betweenDate = addMilliseconds(min, difference / 2);

		console.log(min, betweenDate.toISOString(), max);

		const data: CollectionFormData['z_test_collection'] = {
			...baseData,
			date_field: betweenDate.toISOString()
		};
		const parseResult = schema.safeParse(data);
		console.log(parseResult.error?.issues);
		expect(parseResult.success).toBe(true);
	});
});

function dummyFile(mime = 'text/plain') {
	return new File(['Hello, World!'], 'hello.txt', {
		type: mime,
		lastModified: Date.now()
	});
}

function generateLargeJSONObject(size = 200000) {
	return {
		value: 'x'.repeat(Math.floor(size))
	};
}
