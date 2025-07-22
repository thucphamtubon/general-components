# Ant Design v4 Table Components

## Global Rules

**IMPORTANT**: All code in this directory must always be written according to and comply with:

1. **DRY (Don't Repeat Yourself)** - Avoid code duplication by abstracting common functionality into reusable components, hooks, and utilities.
2. **SRP (Single Responsibility Principle)** - Each module, class, or function should have only one reason to change.

## Implementation Guidelines

### DRY Implementation
- Use hooks for separating and reusing logic
- Create utility functions for common operations
- Extend base components rather than duplicating code
- Maintain consistent interfaces across related components

### SRP Implementation
- Each hook should manage only one aspect of state or behavior
- Components should be focused on rendering or composition, not both
- Keep utility functions small and focused on specific tasks
- Use composition to build complex behavior from simple, single-responsibility pieces

## Directory Structure

```
/table-antd-section
├── components/         # UI components
├── hooks/              # React hooks for stateful logic
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── services/           # Data fetching and manipulation
└── docs/               # Documentation
```

## Usage Examples

See the `/docs` directory for detailed usage examples and best practices.

## Principles in Action

### DRY Example
```typescript
// Instead of repeating pagination logic in multiple components:
const { 
  pagination,
  handlePaginationChange,
  isLoading,
  error,

  pagesCache
} = useTablePagination(defaultPagination, paginationOptions);

// Use consistent interfaces across hooks
const { 
  filters, 
  handleFilterChange 
} = useTableFilters(defaultFilters);
```

### SRP Example
```typescript
// Each hook has a single responsibility:
useTablePagination(); // Only handles pagination
useTableFilters();    // Only handles filters
useTableSorter();     // Only handles sorting

// Orchestrator composes these without violating SRP
useTableOrchestrator(); // Composes smaller hooks
```

## Rule Application Guidelines

| Situation | What to do |
|-----------|------------|
| Repeated code & same context | Apply DRY: create shared function/module |
| Repeated code & different context | Consider carefully. If logic is similar but responsibilities differ → separate implementation |
| Suspected SRP violation | Prioritize SRP over DRY. DRY is a tool, SRP is the core principle |

## Enhanced Pagination Features

The table component includes advanced pagination features:

### Features

- **Flexible Page Sizes**: Customizable page size options (e.g., 10, 25, 50, 100, 200)
- **User Preference Saving**: Automatically saves page size selections to localStorage
- **Navigation Controls**: First, previous, next, and last page buttons
- **Status Handling**: Loading and error states during page transitions
- **Caching**: Remembers visited pages for optimized navigation
- **Localized Information**: Formatted as "A-B của Z bản ghi" (Vietnamese format)

### Usage Example

```typescript
// Basic usage with default options
<EnhancedTable
  columns={columns}
  dataSource={data}
  pagination={{ current: DEFAULT_PAGINATION.current, pageSize: DEFAULT_PAGINATION.pageSize, total: data.length }}
/>

// With advanced pagination options
<EnhancedTable
  columns={columns}
  dataSource={data}
  pagination={{ current: DEFAULT_PAGINATION.current, pageSize: DEFAULT_PAGINATION.pageSize, total: data.length }}
  paginationOptions={{
    tableId: 'unique-table-id',
    pageSizeOptions: ['10', '25', '50', '100', '200'],
    saveUserPreferences: true,
    showInfo: true
  }}
/>
```

## Compliance Check

When adding or modifying code, ask yourself:
- Am I repeating logic that already exists elsewhere? (DRY)
- Does this function/component do more than one thing? (SRP)
- Would a change in requirements cause changes in multiple places? (DRY/SRP)

If you answer "yes" to any of these questions, refactor before submitting.
