/* Type manipulation
 *
 * Issue:
 * - Pocketbase generated types have type [string] instead of [File] for file fields
 * - This is good when fetching data from Pocketbase, cause files are fetched as URLs
 * - But, when sending data to Pocketbase, we send [File] types, not [string]
 *
 * The custom type below take Pocketbase types and replace [string] with [File] where needed
 */

// export type CollectionTypeWithFile<C extends CollectionName> = {
// 	// @ts-expect-error - Slight type mismatch on [K]
// 	[K in keyof CollectionType<C>]: CollectionFieldByName<C, K> extends FileField<1>
// 		? File
// 		: // @ts-expect-error - Slight type mismatch on [K]
// 			CollectionFieldByName<C, K> extends FileField<number>
// 			? File[]
// 			: CollectionType<C>[K];
// };

// type CollectionFieldByName<C extends CollectionName, F extends CollectionFieldName<C>> = Extract<
// 	CollectionFieldConfig<C>,
// 	{ name: F }
// >;

// type CollectionType<C extends CollectionName> = CollectionRecords[C];

// type FileField<Max extends 1 | number> = { type: 'file'; options: { maxSelect: Max } };
