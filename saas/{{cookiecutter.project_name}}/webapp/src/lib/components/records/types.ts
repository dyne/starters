import type { PBRecord, PBResponse, PBResponseKeys } from '$lib/utils/types';

export type RecordInputOptions<R extends PBRecord> = {
	displayFields: PBResponseKeys<PBResponse<R>>[];
	disabled: boolean;
	name: string | undefined;
	excludeIds: string[];
	required: boolean;
	placeholder: string | undefined;
};
