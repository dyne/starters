import type { FormOptions as SuperformOptions } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { ZodObjectTypes, ZodValidation } from './types.temp';
import { defaults, superForm } from 'sveltekit-superforms/client';
import { z } from 'zod';

//

export type FormOptions<T extends ZodValidation<ZodObjectTypes>> = SuperformOptions<z.TypeOf<T>>;

export type SubmitFunction<T extends ZodValidation<ZodObjectTypes>> = NonNullable<
	FormOptions<T>['onUpdate']
>;

export type CreateFormProps<T extends ZodValidation<ZodObjectTypes>> = {
	schema: T;
	onSubmit?: SubmitFunction<T>;
	initialData?: Partial<z.TypeOf<T>>;
	options?: FormOptions<T>;
};

export function createForm<T extends ZodValidation<ZodObjectTypes>>(props: CreateFormProps<T>) {
	const { schema, initialData = {}, options = {}, onSubmit = () => {} } = props;
	const adapter = zod(schema);
	return superForm(defaults(initialData, adapter), {
		SPA: true,
		applyAction: false,
		scrollToError: 'smooth',
		validators: adapter,
		dataType: 'json',
		taintedMessage: null,
		onUpdate: (e) => {
			try {
				if (e.form.valid) onSubmit(e);
			} catch (e) {
				console.log(e);
				// TODO - check if it's needed
				//  let error = normalizeError(e);
				//  for (const [key, value] of Object.entries(error.data)) {
				//      if (Boolean(input.form.data[key])) {
				//          setError(input.form, key as any, value.message);
				//          delete error.data[key];
				//      }
				//  }
				//  setMessage(input.form, error);
			}
		},
		...options
	});
}

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
