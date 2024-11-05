import RecordCreate from './recordCreate.svelte';
import RecordEdit from './recordEdit.svelte';
import RecordDelete from './recordDelete.svelte';
import RecordShare from './recordShare.svelte';
import RecordSelect from './recordSelect.svelte';

export { RecordCreate, RecordEdit, RecordDelete, RecordShare, RecordSelect };

export type RecordAction = 'delete' | 'share' | 'edit' | 'select';
export type GlobalRecordAction = RecordAction | 'create';
