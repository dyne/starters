import CollectionsModels from '@/pocketbase/collections-models/export/collections-models.generated';
import type { AnyCollectionModel } from '@/pocketbase/collections-models/types';
import { isArrayField } from '@/pocketbase/collections-models/utils';
import { camelCase } from 'lodash';
import { capitalize } from 'effect/String';
import prettier from 'prettier';
import fs from 'node:fs/promises';
import path from 'node:path';
import _ from 'lodash';
import assert from 'node:assert';

/* CONSTS */

const COLLECTION_RESPONSES = 'CollectionResponses';
const COLLECTION = 'Collection';

const FORM_DATA = 'FormData';
const EXPAND = 'Expand';
const ZOD_RAW_SHAPE = 'ZodRawShape';

const EXPORT_TYPE = 'export type ';
const SEPARATOR = '/* ------------------ */';

const IMPORT_STATEMENTS = `
import type { ${COLLECTION_RESPONSES} } from '@/pocketbase/types/index.generated'
import type {z} from 'zod'
`;

/* Functions */

main();

async function main() {
	const sortedCollections = _.sortBy(CollectionsModels, (d) => d.name);

	const formDataTypes = sortedCollections.map(createCollectionFormDataType);
	const formDataIndexType = createIndexType(formDataTypes, FORM_DATA);

	const expandTypes = sortedCollections.map(createCollectionExpand);
	const expandIndexType = createIndexType(expandTypes, EXPAND);

	const zodTypes = sortedCollections.map(createCollectionZodRawType);
	const zodIndexType = createIndexType(zodTypes, ZOD_RAW_SHAPE);

	const code = [
		IMPORT_STATEMENTS,
		SEPARATOR,
		...formDataTypes.map((t) => t.type),
		formDataIndexType,
		SEPARATOR,
		...expandTypes.map((t) => t.type),
		expandIndexType,
		SEPARATOR,
		...zodTypes.map((t) => t.type),
		zodIndexType
	].join('\n\n');

	const formatOptions = await prettier.resolveConfig(import.meta.url, { editorconfig: true });
	const formattedCode = await prettier.format(code, { ...formatOptions, parser: 'typescript' });

	await fs.writeFile(path.join(import.meta.dirname, 'extra.generated.ts'), formattedCode);
}

//

function createCollectionFormDataType(model: AnyCollectionModel): GeneratedCollectionTypeData {
	const collectionName = model.name;
	const typeName = capitalize(camelCase(model.name)) + FORM_DATA;

	const fields = model.schema.map((f) => {
		let type: string;
		if (f.type == 'number') type = 'number';
		else if (f.type == 'bool') type = 'boolean';
		else if (f.type == 'date') type = 'string';
		else if (f.type == 'editor') type = 'string';
		else if (f.type == 'email') type = 'string';
		else if (f.type == 'file') type = 'File';
		else if (f.type == 'json') type = 'unknown';
		else if (f.type == 'relation') type = 'string';
		else if (f.type == 'select') type = f.options.values.map((v) => `"${v}"`).join(' | ');
		else if (f.type == 'text') type = 'string';
		else if (f.type == 'url') type = 'string';
		else throw new UnhandledFieldTypeError();
		if (isArrayField(f)) type = `(${type})[]`;
		const optionalQuestionMark = f.required ? '' : '?';
		return `"${f.name}"${optionalQuestionMark} : ${type}`;
	});

	return {
		type: `${EXPORT_TYPE} ${typeName} = { ${fields.join('\n')} }`,
		typeName,
		collectionName
	};
}

function createCollectionExpand(model: AnyCollectionModel): GeneratedCollectionTypeData {
	const collectionName = model.name;
	const typeName = capitalize(camelCase(model.name)) + EXPAND;

	const expands = model.schema
		.filter((field) => field.type == 'relation')
		.map((field) => {
			const model = CollectionsModels.find((m) => m.id == field.options.collectionId);
			assert(model, 'missing model');
			const modelName = model.name;
			const optionalQuestionMark = field.required ? '' : '?';
			return `${field.name}${optionalQuestionMark} : ${COLLECTION_RESPONSES}["${modelName}"]`;
		});

	const expandType = expands.length == 0 ? 'never' : `{ ${expands.join('\n')} }`;

	return {
		type: `${EXPORT_TYPE} ${typeName} = ${expandType}`,
		typeName,
		collectionName
	};
}

function createCollectionZodRawType(model: AnyCollectionModel): GeneratedCollectionTypeData {
	const collectionName = model.name;
	const typeName = capitalize(camelCase(model.name)) + ZOD_RAW_SHAPE;

	const fields = model.schema.map((f) => {
		let type: string;
		if (f.type == 'number') type = 'z.ZodNumber';
		else if (f.type == 'bool') type = 'z.ZodBoolean';
		else if (f.type == 'date') type = 'z.ZodString';
		else if (f.type == 'editor') type = 'z.ZodString';
		else if (f.type == 'email') type = 'z.ZodString';
		else if (f.type == 'file') type = 'z.ZodType<File>';
		else if (f.type == 'json') type = 'z.ZodUnknown';
		else if (f.type == 'relation') type = 'z.ZodString';
		else if (f.type == 'select') type = `z.ZodEnum<${JSON.stringify(f.options.values)}>`;
		else if (f.type == 'text') type = 'z.ZodString';
		else if (f.type == 'url') type = 'z.ZodString';
		else throw new UnhandledFieldTypeError();
		if (isArrayField(f)) type = `z.ZodArray<${type}>`;
		if (!f.required) type = `z.ZodOptional<${type}>`;
		return `"${f.name}" : ${type}`;
	});

	return {
		type: `${EXPORT_TYPE} ${typeName} = { ${fields.join('\n')} }`,
		typeName,
		collectionName
	};
}

function createIndexType(data: GeneratedCollectionTypeData[], category: string) {
	const entries = data.map((d) => `${d.collectionName} : ${d.typeName}`);
	return `${EXPORT_TYPE} ${COLLECTION}${category}s = { ${entries.join('\n')} }`;
}

//

class UnhandledFieldTypeError extends Error {}

type GeneratedCollectionTypeData = {
	type: string;
	collectionName: string;
	typeName: string;
};
