# Table Component Test IDs

This document lists all the `data-testid` attributes used in the table-antd-section components for automation testing.

## BaseTable Component

### Table Elements
- `data-testid="base-table"` - The main table container
- `data-testid="table-loading-spinner"` - Loading spinner when table is loading

### Rows
- `data-testid="table-row-{id}"` - Each table row, where `{id}` is the row's unique identifier
- `data-row-key="{id}"` - The unique key of each row (used by Ant Design)

## EnhancedTable Component

### Pagination
- `data-testid="enhanced-table-pagination-controls"` - Container for pagination controls
- `data-testid="pagination-first-page-btn"` - "First page" button
- `data-testid="pagination-last-page-btn"` - "Last page" button
- `data-testid="pagination-error-message"` - Error message in pagination (if any)

### Cache Info
- `data-testid="enhanced-table-cache-info"` - Information about cached pages

## Cell Testing Pattern

For testing individual cells, use the column's `render` function to add specific test IDs:

```typescript
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <span data-testid={`cell-name-${record.id}`}>{text}</span>
    )
  }
];
```

## Example Test Selectors

```typescript
// Select a specific row
const row = document.querySelector('[data-testid="table-row-123"]');

// Select a specific cell
const cell = document.querySelector('[data-testid="cell-name-123"]');

// Click pagination button
const firstPageBtn = document.querySelector('[data-testid="pagination-first-page-btn"]');
```

## Best Practices

1. Always use `data-testid` for test selectors instead of class names or other attributes
2. Keep test IDs consistent across similar components
3. Include the record ID in test IDs when possible for better test reliability
4. Document any new test IDs added to the components
