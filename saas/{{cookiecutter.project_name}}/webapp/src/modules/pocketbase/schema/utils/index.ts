import { type FieldConfig, FieldType } from '@/pocketbase/schema/types';

//

export function isArrayField(fieldConfig: FieldConfig): boolean {
	const type = fieldConfig.type as FieldType;
	if (type !== FieldType.SELECT && type !== FieldType.RELATION && type !== FieldType.FILE)
		return false;

	const maxSelect = fieldConfig.options.maxSelect ?? 0;
	if (maxSelect > 1) return true;
	else return false;
}

export function isRequiredField(fieldConfig: FieldConfig): boolean {
	return fieldConfig.required;
}
