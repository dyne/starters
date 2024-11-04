<script lang="ts" generics="T">
	import { Cell } from '@/components/ui/table';
	import type { KeyOf } from '@/utils/types';
	import { capitalize } from 'lodash';

	export let field: KeyOf<T> | undefined = undefined;
	export let label: string | undefined = undefined;
</script>

<Cell><slot /></Cell>
