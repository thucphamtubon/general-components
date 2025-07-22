# Table Orchestrator Hooks

This directory contains a collection of React hooks that facilitate table functionality in the Ant Design Table implementation. These hooks follow a modular design pattern to separate concerns and provide reusable functionality for table operations.

## Available Hooks

### useTableChangeHandler

**Purpose**: Manages combined table change events from Ant Design Table.

**Key Features**:
- Handles filter, sorter, and pagination changes in a unified handler
- Properly processes array sorters and pagination objects
- Preserves dependency arrays for optimal rendering

**Usage Example**:
```typescript
const { handleTableChange } = useTableChangeHandler({
  handleFilterChange: (filters) => setFilters(filters),
  handleSorterChange: (sorter) => setSorter(sorter),
  handlePaginationChange: (current, pageSize) => setPagination({ current, pageSize })
});
```

### useTableClear

**Purpose**: Provides functionality to clear all table filters, sorters, and search.

**Key Features**:
- Integrates with the table filters and sorter store
- Clears search state
- Resets table to default state

**Usage Example**:
```typescript
const { handleClearAll } = useTableClear({
  tableId: 'products-table',
  paginationConfig: { current: 1, pageSize: 10 },
  clearSearch: () => setSearchTerm(''),
  handleTableChange
});
```

### useTableReset

**Purpose**: Handles reset functionality for the table to return to initial state.

**Key Features**:
- Comprehensive reset of all table states
- Single function call to reset pagination, filters, sorters, selection, and search

**Usage Example**:
```typescript
const { resetTable } = useTableReset({
  resetPaginationConfig: () => setPagination(defaultPagination),
  clearFilters: () => setFilters({}),
  clearSorter: () => setSorter({}),
  clearSelection: () => setSelectedRowKeys([]),
  clearSearch: () => setSearchTerm('')
});
```

### useTableRowSelectionConfig

**Purpose**: Manages row selection configuration for Ant Design Table.

**Key Features**:
- Creates selection configuration compatible with Ant Design Table
- Handles selected rows state and callbacks
- Preserves selected row keys between renders

**Usage Example**:
```typescript
const { rowSelectionConfig } = useTableRowSelectionConfig({
  rowSelection: true,
  selectedRowKeys,
  handleSelectionChange: (keys, rows) => setSelectedRowKeys(keys),
  dataSource,
  rowKey: 'id',
  onSelectionChange: (keys, rows) => console.log('Selection changed', rows)
});
```

### useTableSearchHandler

**Purpose**: Manages search functionality for tables.

**Key Features**:
- Handles search term state changes
- Supports different search modes
- Synchronizes with external search terms
- Provides callbacks for search events

**Usage Example**:
```typescript
const { handleSearchChange, handleClearSearch } = useTableSearchHandler({
  searchTerm,
  setSearchTerm,
  setSearchMode,
  clearSearch: () => setSearchTerm(''),
  externalSearchTerm: props.searchTerm,
  onSearch: (term) => console.log('Search term:', term)
});
```

### useTableVisibility

**Purpose**: Manages column visibility in tables.

**Key Features**:
- Controls which columns are displayed
- Handles visibility change events
- Filters columns based on visibility settings

**Usage Example**:
```typescript
const { visibleColumnKeys, visibleColumns, handleColumnsVisibilityChange } = useTableVisibility({
  columns,
  defaultVisibleColumnKeys: ['name', 'age', 'address'],
  visibleColumnKeys: props.visibleColumnKeys,
  setVisibleColumnKeys: props.setVisibleColumnKeys
});
```

## Integration

These hooks are designed to work together within the `useTableOrchestrator` hook, which combines all of the above functionality into a comprehensive table management solution.

## Best Practices

- Always provide a unique `tableId` for tables that use filters or sorters
- Keep hook dependencies updated to prevent stale closures
- Use the reset functionality when table state becomes complex
- Consider using controlled components for advanced use cases
