<script lang="ts">
	import { CollectionForm } from '@/collections-components';
	import { m } from '@/i18n';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '@/components/custom/pageCard.svelte';
	import PageTop from '@/components/custom/pageTop.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import Icon from '@/components/custom/icon.svelte';
	import { Button } from '@/components/ui/button';
	import T from '@/components/custom/t.svelte';
</script>

<PageTop>
	<Button href="/my/organizations" variant="outline" size="sm">
		<Icon src={ArrowLeft} mr></Icon>
		{m.Back_to_my_organizations()}
	</Button>
	<T tag="h4">{m.Create_an_organization()}</T>
</PageTop>

<PageContent>
	<PageCard>
		<CollectionForm
			collection="organizations"
			fieldsOptions={{
				labels: {
					name: m.Organization_name(),
					description: m.Short_description(),
					avatar: m.Avatar()
				}
			}}
			uiOptions={{
				submitButtonText: m.Create_organization()
			}}
			onSuccess={(record) => {
				window.location.assign(`/my/organizations/${record.id}`);
			}}
		/>
	</PageCard>
</PageContent>
