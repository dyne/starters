import type { AnyFieldConfig } from './types';

//

export function isArrayField(fieldConfig: AnyFieldConfig): boolean {
	const type = fieldConfig.type;
	if (type !== 'select' && type !== 'relation' && type !== 'file') return false;
	if (fieldConfig.options.maxSelect === 1) return false;
	else return true;
}

export function isRequiredField(fieldConfig: AnyFieldConfig): boolean {
	return fieldConfig.required;
}
