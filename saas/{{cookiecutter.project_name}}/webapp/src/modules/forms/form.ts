import { normalizeError } from '@/utils/other';
import type { GenericRecord } from '@/utils/types';
import type { FormOptions as SuperformOptions } from 'sveltekit-superforms';
import { type ValidationAdapter } from 'sveltekit-superforms/adapters';
import { defaults, setError, superForm } from 'sveltekit-superforms/client';

//

export type SubmitFunction<Data extends GenericRecord> = NonNullable<
	SuperformOptions<Data>['onUpdate']
>;

export type CreateFormProps<Data extends GenericRecord> = {
	adapter: ValidationAdapter<Data>;
	options?: Omit<SuperformOptions<Data>, 'onUpdate'>;
	onSubmit?: SubmitFunction<Data>;
	initialData?: Partial<Data>;
};

export function createForm<Data extends GenericRecord>(props: CreateFormProps<Data>) {
	const { adapter, initialData = {} as Partial<Data>, options = {}, onSubmit = () => {} } = props;
	const form = defaults(initialData, adapter);
	return superForm(form, {
		SPA: true,
		applyAction: false,
		scrollToError: 'smooth',
		validators: adapter,
		dataType: 'json',
		taintedMessage: null,
		onUpdate: async (event) => {
			try {
				if (event.form.valid) await onSubmit(event);
			} catch (e) {
				setError(event.form, normalizeError(e));
			}
		},
		...options
	});
}

export const FORM_ERROR_PATH = '_errors';

// TODO - This is old code that should not be needed anymore
//  let error = normalizeError(e);
//  for (const [key, value] of Object.entries(error.data)) {
//      if (Boolean(input.form.data[key])) {
//          setError(input.form, key as any, value.message);
//          delete error.data[key];
//      }
//  }
//  setMessage(input.form, error);

// TODO - CreateFormData should be replaced by https://www.npmjs.com/package/@octetstream/object-to-form-data

// TODO - Maybe needed

// type SuperFormAllErrors = {
// 	path: string;
// 	messages: string[];
// }[];

// export function formHasErrors(allErrors: SuperFormAllErrors): boolean {
// 	const checks: boolean[] = [];
// 	if (allErrors.length === 0) return false;
// 	else {
// 		for (const error of allErrors) {
// 			if (error.messages.length > 0) checks.push(true);
// 			// if (typeof value === 'object') checks.push(formHasErrors(value));
// 			// else if (Boolean(value)) checks.push(true);
// 		}
// 	}
// 	return checks.some((check) => check);
// }
