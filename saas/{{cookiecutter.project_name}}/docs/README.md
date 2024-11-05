<!-- # Building blocks

# Stake holders

# Deployment

# Goals

# Non-functional requirements

# Context and scope (external systems and interfaces)

# Technical debt and risks

# Glossary -->

# SAASroom

> A lovely way to build webapps 🥰

## Hey there! 👋

SAASroom is a comprehensive project template that provides everything you need to build modern web applications, with a focus on developer experience.

It combines a robust core stack with pre-built modules to accelerate your development process.

### Core stack

- Backend: [Pocketbase](https://pocketbase.io/) (in the `/admin` folder)
- Frontend: [SvelteKit](https://svelte.dev/) (in the `/webapp` folder)

### Main Features

- 🔐 User authentication (including WebAuthn support)
- 👥 Organization management, roles and access control
- ✉️ Transactional emails system
- 📝 Audit loggging
- ⚡ Intuitive CRUD interface
- 🎯 Accessible UI components (powered by [shadcn-svelte](https://www.shadcn-svelte.com/))
- 🌍 i18n - Internationalization (built with [@inlang/paraglide-js](https://inlang.com/m/gerre34r/library-inlang-paraglideJs))
- 🛡️ Type-safety (even where you don't expect it) and codegen for improved DX

## House specialty 👨‍🍳

What makes SAASroom interesting are the pre-baked modules in the `/webapp/src/modules`. These modules significantly accelerate development time by providing ready-to-use functionality.

For example, you can create a fully-featured CRUD editor for **any database collection** with just a few lines of code:

```svelte
<script lang="ts">
	import { CollectionManager } from '@/collections-components/manager';
</script>

<CollectionManager
	collection="z_test_collection"
>
	<svelte:fragment slot="top" let:Search let:Header>
		<Header />
	</svelte:fragment>

	<svelte:fragment slot="records" let:records let:Table>
		<Table {records} fields={['id', 'text_field', 'relation_field', 'created']}></Table>
	</svelte:fragment>
</CollectionManager>
```

![Collection Manager](./images/collection-manager.gif)

## Modules 📚

For detailed information about the available modules and their documentation, please refer to this index:

- [Forms](./modules/forms/index.md)
- [Collection Manager](./modules/collection-manager.md)
