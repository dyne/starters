import type { CollectionName } from '@/pocketbase/collections-models';
import type { ExpandQueryOption, PocketbaseQueryOptions, QueryResponse } from '@/pocketbase/query';
import type { CollectionRecords } from '@/pocketbase/types';
import type { RecordPresenter } from './utils';

export interface CollectionSelectBaseProps<
	C extends CollectionName,
	Expand extends ExpandQueryOption<C> = never
> {
	collection: C;
	queryOptions?: Partial<PocketbaseQueryOptions<C, Expand>>;
	disabled?: boolean;
	label?: string | undefined;
	placeholder?: string | undefined;
	onSelect?: (record: QueryResponse<C, Expand>) => void;
	displayFields?: (keyof CollectionRecords[C])[] | undefined;
	displayFn?: RecordPresenter<QueryResponse<C, Expand>> | undefined;
	clearValueOnSelect?: boolean;
}
