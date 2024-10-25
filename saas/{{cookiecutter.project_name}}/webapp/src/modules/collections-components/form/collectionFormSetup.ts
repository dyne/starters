import type {
	AnyCollectionModel,
	FieldConfig,
	CollectionName,
	FieldType
} from '@/pocketbase/collections-models/types';
import { pipe, Record, String } from 'effect';
import type { CollectionFormMode, CollectionFormOptions } from './formOptions';
import { setError, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
import { getCollectionModel } from '@/pocketbase/collections-models';
import { createCollectionZodSchema } from '@/pocketbase/zod-schema';
import z from 'zod';
import type { GenericRecord, MaybePromise } from '@/utils/types';
import { merge, cloneDeep } from 'lodash';
import { pb } from '@/pocketbase';
import { createForm } from '@/forms';
import { zod } from 'sveltekit-superforms/adapters';
import { ensureArray, normalizeError } from '@/utils/other';
import { ClientResponseError } from 'pocketbase';
import type { RecordIdString } from '@/pocketbase/types';

//

type SetupCollectionFormProps<C extends CollectionName, Data extends GenericRecord> = {
	collection: CollectionName;
	recordId?: RecordIdString;
	options?: CollectionFormOptions<C>;
	onSuccess?: (record: Data, mode: CollectionFormMode) => MaybePromise<void>;
};

export async function setupCollectionForm<C extends CollectionName, Data extends GenericRecord>({
	collection,
	recordId = undefined,
	options = {},
	onSuccess = () => {}
}: SetupCollectionFormProps<C, Data>): Promise<SuperForm<Data>> {
	const collectionModel = getCollectionModel(collection);

	/* Schema creation */

	const baseSchema = createCollectionZodSchema(collection) as z.AnyZodObject;
	const schema = baseSchema
		.omit(Object.fromEntries((options.fields?.exclude ?? []).map((key) => [key, true])))
		.strip() // Very important!
		.strict();

	/* Initial data */

	let initialData: GenericRecord = {};
	if (recordId) initialData = await pb.collection(collection).getOne(recordId);

	/* Initial data processing */
	/* This must be done for two reasons
	 *
	 * 1. File fields
	 *
	 * Form expects a file,
	 * but file data coming from PocketBase is a string
	 *
	 * We solve it this way:
	 * -  Store the original initial data
	 * -  Convert the strings to "placeholder" files
	 * -  When submitting the form, match the new files with the original filenames
	 *
	 * 2. JSON fields
	 *
	 * JSON fields come from the server as objects
	 * but we edit them on the client as strings
	 *
	 * -
	 *
	 * (Also, useful for seeding and cleaning data)
	 */

	const processedInitialData = pipe(
		merge(cloneDeep(initialData), options.fields?.defaults, options.fields?.hide), // Seeding data
		(data) => mockInitialDataFiles(data, collectionModel),
		(data) => stringifyJsonFields(data, collectionModel),
		Record.filter((v) => Boolean(v)), // Useful to remove `undefined` that sometimes cause problems
		(data) => schema.parse(data) // Strips excess properties
	);

	/* Form creation */

	const form = createForm({
		adapter: zod(schema),
		initialData: processedInitialData,
		options: {
			dataType: 'form',
			...(options.superform ?? {})
		},

		onSubmit: async ({ form }) => {
			try {
				const data = pipe(
					cleanFormDataFiles(form.data, processedInitialData, collectionModel),
					Record.map((v) => (v === undefined ? null : v)) // IMPORTANT!
				);
				if (recordId) {
					const record = await pb.collection(collection).update<Data>(recordId, data);
					onSuccess(record, 'update');
				} else {
					const record = await pb.collection(collection).create<Data>(data);
					onSuccess(record, 'create');
				}
			} catch (e) {
				if (e instanceof ClientResponseError) {
					const details = e.data.data as Record<
						FormPathLeaves<Data>,
						{ message: string; code: string }
					>;

					Record.toEntries(details).forEach(([path, data]) => {
						if (path in form.data) setError(form, path, data.message);
						else setError(form, `${path} - ${data.message}`);
					});

					setError(form, e.message);
				} else {
					setError(form, normalizeError(e));
				}
			}
		}
	});

	//

	return form as SuperForm<Data>;
}

//

function mockInitialDataFiles(recordData: GenericRecord, collectionModel: AnyCollectionModel) {
	return mapRecordDataByFieldType(
		recordData,
		collectionModel,
		'file',
		(fieldValue, fieldConfig) => {
			if (Array.isArray(fieldValue) && fieldValue.every(String.isString)) {
				return fieldValue.map((filename) => mockFile(filename, fieldConfig));
			} else if (String.isString(fieldValue)) {
				return mockFile(fieldValue, fieldConfig);
			} else {
				return fieldValue;
			}
		}
	);
}

function mockFile(filename: string, fileFieldConfig: FieldConfig<'file'>) {
	let fileOptions: FilePropertyBag | undefined = undefined;
	const mimeTypes = fileFieldConfig.options.mimeTypes;
	if (Array.isArray(mimeTypes) && mimeTypes.length > 0) {
		fileOptions = { type: mimeTypes[0] };
	}
	const mockFile = new File([], filename, fileOptions);
	return mockFile;
}

//

function stringifyJsonFields(recordData: GenericRecord, collectionModel: AnyCollectionModel) {
	return mapRecordDataByFieldType(recordData, collectionModel, 'json', (fieldValue) => {
		if (!fieldValue) return fieldValue;
		return JSON.stringify(fieldValue);
	});
}

//

export function cleanFormDataFiles(
	recordData: GenericRecord,
	initialData: GenericRecord,
	model: AnyCollectionModel
) {
	const data = cloneDeep(recordData);

	const initialDataFileFields = pipe(
		initialData,
		Record.filter((_, fieldName) => {
			return Boolean(
				model.schema.find(
					(fieldConfig) => fieldConfig.name == fieldName && fieldConfig.type == 'file'
				)
			);
		}),
		Record.filter(String.isString), // Ensure filenames
		Record.map((v) => ensureArray(v)) // Ensuring array for easier checking
	);

	for (const [field, initialFilenames] of Object.entries(initialDataFileFields)) {
		const newFieldValue = data[field];

		if (newFieldValue === undefined || newFieldValue === null) {
			continue;
		}
		//
		else if (newFieldValue instanceof File) {
			const isFileOld = initialFilenames.includes(newFieldValue.name);
			if (isFileOld) delete data[field];
		}
		//
		else if (Array.isArray(newFieldValue) && newFieldValue.every((v) => v instanceof File)) {
			const allFilenames = newFieldValue.map((file) => file.name);
			const newFiles = newFieldValue.filter((file) => !initialFilenames.includes(file.name));
			const filesToRemove = initialFilenames.filter((filename) => !allFilenames.includes(filename));

			if (newFiles.length === 0) delete data[field];
			else data[field] = newFiles;

			if (filesToRemove.length > 0) data[`${field}-`] = filesToRemove;
		}
	}

	return data;
}

/* Utils */

class FieldConfigNotFound extends Error {}

function mapRecordDataByFieldType<T extends FieldType = never>(
	recordData: GenericRecord,
	model: AnyCollectionModel,
	fieldType: T,
	handler: (value: unknown, fieldConfig: FieldConfig<T>) => unknown
) {
	return pipe(
		recordData,
		Record.map((fieldValue, fieldName) => {
			const fieldConfig = model.schema.find((field) => field.name == fieldName);
			if (!fieldConfig) throw new FieldConfigNotFound();
			if (fieldConfig.type != fieldType) return fieldValue;
			return handler(fieldValue, fieldConfig as FieldConfig<T>);
		})
	);
}
