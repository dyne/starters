import type { CollectionName } from '@/pocketbase/collections-models/types';
import type { CollectionExpands, CollectionResponses } from '@/pocketbase/types';
import type { If } from '@/utils/types';

//

export type ExpandableResponse<
	C extends CollectionName,
	Expand extends boolean,
	Response = CollectionResponses[C]
> = If<Expand, Response & { expand?: Partial<CollectionExpands[C]> }, Response>;
