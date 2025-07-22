# Ant Design v4 Table Components

A collection of reusable and extendable table components built on top of Ant Design v4 Table. These components follow DRY (Don't Repeat Yourself) and SRP (Single Responsibility Principle) design principles.

## Components

### BaseTable

A simple wrapper around the Ant Design v4 Table component with some default configurations and additional features like filtering out hidden columns.

```tsx
import { BaseTable } from '../table-antd-section';

const SimpleTable = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      hidden: window.innerWidth < 768, // This column will be hidden on small screens
    }
  ];

  const data = [
    { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  ];

  return <BaseTable columns={columns} dataSource={data} />;
};
```

### EnhancedTable

A more feature-rich table component that includes search, pagination, sorting, and row selection out of the box.

```tsx
import { EnhancedTable } from '../table-antd-section';
import { Key } from 'react';

const EnhancedTableExample = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      searchable: true, // This field will be included in search
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      searchable: true,
      responsive: ['md', 'lg', 'xl'], // This column will only show on medium and larger screens
    }
  ];

  const data = [
    { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
    { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
  ];

  const handleSelectionChange = (selectedRowKeys: Key[], selectedRows: any[]) => {
    console.log('Selected rows:', selectedRows);
  };

  const handleSearch = (searchTerm: string) => {
    console.log('Search term:', searchTerm);
    // You could filter data here or fetch from an API
  };

  return (
    <EnhancedTable 
      columns={columns} 
      dataSource={data} 
      rowSelection={true}
      onSelectionChange={handleSelectionChange}
      onSearch={handleSearch}
      pagination={true}
    />
  );
};
```

## Hooks

This library provides several hooks that follow SRP, allowing you to pick and choose the functionality you need:

### useTablePagination

Manages pagination state and provides handlers for pagination changes.

```tsx
import { useTablePagination } from '../table-antd-section';

const { pagination, handlePaginationChange, resetPaginationConfig } = useTablePagination({
  current: DEFAULT_PAGINATION.current,
  pageSize: DEFAULT_PAGINATION.pageSize
});
```

### useTableFilters

Manages filter state and provides handlers for filter changes.

```tsx
import { useTableFilters } from '../table-antd-section';

const { filters, handleFilterChange, clearFilters } = useTableFilters({
  status: ['active', 'processing']
});
```

### useTableSorter

Manages sort state and provides handlers for sort changes.

```tsx
import { useTableSorter } from '../table-antd-section';

const { sorter, handleSorterChange, clearSorter } = useTableSorter({
  columnKey: 'age',
  order: 'ascend'
});
```

### useTableSelection

Manages row selection state and provides handlers for selection changes.

```tsx
import { useTableSelection } from '../table-antd-section';

const { selectedRowKeys, handleSelectionChange, clearSelection } = useTableSelection(['1', '3']);
```

### useTableSearch

Manages search state and provides handlers for search changes.

```tsx
import { useTableSearch } from '../table-antd-section';

const { searchTerm, handleSearch } = useTableSearch('initial search');
```

### useTableOrchestrator

Combines all the above hooks into a single unified API for easier use.

```tsx
import { useTableOrchestrator } from '../table-antd-section';

const {
  filters,
  sorter,
  pagination,
  selectedRowKeys,
  searchTerm,
  handleTableChange,
  handleSearch,
  handleSelectionChange,
  resetTable
} = useTableOrchestrator({
  defaultPagination: { current: DEFAULT_PAGINATION.current, pageSize: DEFAULT_PAGINATION.pageSize },
  defaultSelectedRowKeys: ['1'],
  defaultSearchTerm: ''
});
```

## Utilities

### tableUtils

A collection of helper functions for table operations.

```tsx
import { tableUtils } from '../table-antd-section';

// Filter data by search term
const filteredData = tableUtils.filterDataBySearchTerm(data, searchTerm);

// Get responsive columns based on breakpoint
const visibleColumns = tableUtils.getResponsiveColumns(columns, 'md');

// Apply default props to all columns
const enhancedColumns = tableUtils.applyColumnDefaults(columns, {
  align: 'left',
  ellipsis: true
});

// Remove diacritics from Vietnamese text for better search
const normalizedText = tableUtils.removeDiacritics('Xin chào');
```
