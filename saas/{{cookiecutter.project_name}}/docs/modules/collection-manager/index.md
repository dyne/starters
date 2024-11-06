# Collection Manager

<br />

## Overview

The `CollectionManager` is a component / abstraction that makes it really simple to create a complete CRUD UI for **any database collection**.

The features:

- display, create, edit, delete and share records
- pagination
- text search
- data tables with sorting
- record cards
- empty state and error state
- automatic database subscriptions
- (upcoming: batch actions)

<br />

## Basic setup

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

![Collection Manager](../../images/collection-manager.gif)

<br />

## The slots

The `CollectionManager` features are conveniently organized in slots: useful components and data are available via [slot props](https://svelte.dev/docs/svelte/legacy-slots#Passing-data-to-slotted-content) right where you need them.

> [!NOTE]  
> Components slot props names start with an uppercase letter, while data props start in lowercase.

```svelte
<CollectionManager
    collection="z_test_collection"
>
    <svelte:fragment slot="top" let:Header let:Search>
        <!-- ...  -->
    </svelte:fragment>

    <svelte:fragment slot="records" let:records let:Table let:Card let:Pagination>
        <!-- ... -->
    </svelte:fragment>

    <svelte:fragment slot="emptyState" let:EmptyState>
        <!-- ... -->
    </svelte:fragment>
</CollectionManager>
```

- Slot `top`

  - `Header` displays the collection name and the create button
  - `Search` adds a searchbar for full-text search on the records

- Slot `records` (displayed only when records are available)

  - `records` is an array of all the records found (depending on search, filters and pagination)
  - `Table` is a data grid used to display the records
  - `Card` displays a single record with buttons for the various actions (edit, share, delete, select)
  - `Pagination` can be used if you want to control the pagination position manually

- Slot `emptyState` (displayed when no records are found)
  - `EmptyState` is a generic component that can be used to customize the empty state

<br />

## Collection Manager props

<!-- TODO -->
