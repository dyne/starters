export * from './index.generated';
export type { CollectionFormData } from './collectionFormData';

//

import type { CollectionRecords, CollectionResponses } from './index.generated';
export type CollectionRecord<C extends keyof CollectionRecords> = CollectionRecords[C];
export type CollectionResponse<C extends keyof CollectionResponses> = CollectionResponses[C];
