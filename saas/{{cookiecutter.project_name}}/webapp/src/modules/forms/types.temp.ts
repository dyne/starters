// Copied from "sveltekit-superforms/adapters/zod"

import type { AnyZodObject, ZodDefault, ZodEffects, ZodType, ZodTypeDef, ZodUnion } from 'zod';

type ZodObjectUnion<T extends AnyZodObject> = ZodUnion<
	[ZodValidation<T>, ZodValidation<T>, ...ZodValidation<T>[]]
>;
type ZodObjectType = ZodType<Record<string, unknown>, ZodTypeDef, Record<string, unknown>>;

export type ZodObjectTypes = AnyZodObject | ZodObjectUnion<AnyZodObject> | ZodObjectType;

export type ZodValidation<T extends ZodObjectTypes> =
	| T
	| ZodEffects<T>
	| ZodEffects<ZodEffects<T>>
	| ZodEffects<ZodEffects<ZodEffects<T>>>
	| ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>
	| ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>
	| ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>>
	| ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>>>
	| ZodDefault<T>
	| ZodDefault<ZodEffects<T>>
	| ZodDefault<ZodEffects<ZodEffects<T>>>
	| ZodDefault<ZodEffects<ZodEffects<ZodEffects<T>>>>
	| ZodDefault<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>
	| ZodDefault<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>>
	| ZodDefault<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>>>
	| ZodDefault<
			ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>>>
	  >;
