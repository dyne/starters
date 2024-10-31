import { getCollectionModel, type CollectionName } from '@/pocketbase/collections-models';
import type { CollectionExpands, CollectionResponses, RecordIdString } from '@/pocketbase/types';
import type { KeyOf } from '@/utils/types';
import PocketBase, {
	type ListResult,
	type RecordFullListOptions,
	type RecordListOptions
} from 'pocketbase';
import { pb } from '.';
import type { Simplify } from 'type-fest';
import { Option, String } from 'effect';

//

export type ExpandQueryOption<C extends CollectionName> = KeyOf<CollectionExpands[C]>[];

export type ResolveExpandOption<C extends CollectionName, E extends ExpandQueryOption<C>> = Partial<
	Pick<CollectionExpands[C], E[number]>
>;

export type QueryResponse<
	C extends CollectionName,
	Expand extends ExpandQueryOption<C> = never
> = CollectionResponses[C] & {
	expand?: ResolveExpandOption<C, Expand>;
};

type PocketbaseListOptions = Simplify<RecordFullListOptions | RecordListOptions>;
// type PocketbaseListOptions = Omit<RecordFullListOptions | RecordListOptions, "filter" | "expand" |"sort" | "search" >

type PocketbaseQueryOptions<C extends CollectionName, E extends ExpandQueryOption<C>> = {
	filter: string;
	expand: E;
	exclude: RecordIdString[];
	search: string;
	sort: string;
	pocketbase: PocketBase;
	pocketbaseListOptions: PocketbaseListOptions;
};

export class PocketbaseQuery<C extends CollectionName, E extends ExpandQueryOption<C>> {
	constructor(
		public collection: C,
		public options: Partial<PocketbaseQueryOptions<C, E>> = {}
	) {}

	get pocketbase(): PocketBase {
		return this.options.pocketbase ?? pb;
	}

	// Filters

	get baseFilter(): Option.Option<string> {
		return Option.fromNullable(this.options.filter);
	}

	get excludeFilter(): Option.Option<string> {
		return Option.fromNullable(this.options.exclude).pipe(
			Option.map((ids) => ids.map((id) => `id != '${id}'`).join(' && '))
		);
	}

	get searchFilter(): Option.Option<string> {
		return Option.fromNullable(this.options.search).pipe(
			Option.map((searchText) => {
				const fieldNames = getCollectionModel(this.collection).schema.map((field) => field.name);
				if (this.collection == 'users') fieldNames.push('email');
				return fieldNames.map((f) => `${f} ~ "${searchText}"`).join(' || ');
			})
		);
	}

	// Options

	get filterOption(): Option.Option<string> {
		const filter = [this.baseFilter, this.excludeFilter, this.searchFilter]
			.filter(Option.isSome)
			.map(Option.getOrThrow)
			.map((filter) => `( ${filter} )`)
			.join(' && ');
		return String.isNonEmpty(filter) ? Option.some(filter) : Option.none();
	}

	get expandOption(): Option.Option<string> {
		return Option.fromNullable(this.options.expand).pipe(Option.map((expand) => expand.join(', ')));
	}

	get pocketbaseListOptions(): PocketbaseListOptions {
		const { sort = '-created', pocketbaseListOptions = {} } = this.options;

		return {
			requestKey: null,
			sort,
			expand: this.expandOption.pipe(Option.getOrUndefined),
			filter: this.filterOption.pipe(Option.getOrUndefined),
			...pocketbaseListOptions
		};
	}

	//

	getFullList(): Promise<QueryResponse<C, E>[]> {
		return pb.collection(this.collection).getFullList(this.pocketbaseListOptions);
	}

	getList(currentPage: number, perPage: number): Promise<ListResult<QueryResponse<C, E>>> {
		return pb.collection(this.collection).getList(currentPage, perPage, this.pocketbaseListOptions);
	}
}
