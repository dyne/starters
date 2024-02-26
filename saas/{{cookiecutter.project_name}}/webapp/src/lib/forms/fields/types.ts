import type { ComponentProps } from 'svelte';
import type FieldWrapper from './fieldWrapper.svelte';
import type { BaseRecord } from '$lib/utils/types';

type FieldWrapperProps<T extends BaseRecord = BaseRecord> = ComponentProps<FieldWrapper<T>>;

export type InfoProps<T extends BaseRecord = BaseRecord> = Omit<
	FieldWrapperProps<T>,
	'form' | 'field'
>;
