# Table Filters & Sorter Store

Store này được tạo để quản lý trạng thái filters và sorter của bảng, tương tự như `useTableSearchStore` nhưng dành riêng cho filters và sorter.

## Cấu trúc

### Store: `useTableFiltersAndSorterStore`

Store sử dụng Zustand với persist middleware để lưu trữ trạng thái filters và sorter vào localStorage.

```typescript
interface FiltersAndSorterState {
  filters: FilterState;
  sorter: SortState;
}
```

### Hook: `useTableFiltersAndSorter`

Hook này cung cấp interface để tương tác với store và quản lý trạng thái local.

## Cách sử dụng

### 1. Import

```typescript
import { 
  useTableFiltersAndSorter, 
  useTableFiltersAndSorterStore,
  FiltersAndSorterState 
} from './table-antd-section';
```

### 2. Sử dụng Hook

```typescript
const {
  filters,
  sorter,
  setFilters,
  setSorter,
  handleFilterChange,
  handleSorterChange,
  clearFilters,
  clearSorter,
  clearAll,
  resetToDefault,
} = useTableFiltersAndSorter(
  { filters: {}, sorter: {} }, // defaultConfig
  { 
    tableId: 'my-table', 
    saveUserPreferences: true 
  }
);
```

### 3. Sử dụng với EnhancedTable

```typescript
<EnhancedTable
  tableId="my-table"
  columns={columns}
  dataSource={data}
  onFilterChange={handleFilterChange}
  onSortChange={handleSorterChange}
/>
```

### 4. Sử dụng Store trực tiếp

```typescript
const { 
  setFilters, 
  setSorter, 
  clearAll 
} = useTableFiltersAndSorterStore();

// Set filters cho table cụ thể
setFilters('my-table', { status: ['active'] });

// Set sorter cho table cụ thể  
setSorter('my-table', { columnKey: 'name', order: 'ascend' });

// Clear tất cả cho table cụ thể
clearAll('my-table');
```

## API Reference

### Hook Options

```typescript
interface TableFiltersAndSorterOptions {
  tableId?: string; // ID của table, mặc định 'default-table'
  saveUserPreferences?: boolean; // Có lưu vào localStorage không, mặc định true
}
```

### Hook Return

```typescript
interface UseTableFiltersAndSorterReturn {
  filters: FilterState;
  sorter: SortState;
  setFilters: (filters: FilterState) => void;
  setSorter: (sorter: SortState) => void;
  handleFilterChange: (filters: Record<string, any>) => void;
  handleSorterChange: (sorter: SorterResult<any> | SorterResult<any>[]) => void;
  clearFilters: () => void;
  clearSorter: () => void;
  clearAll: () => void;
  resetToDefault: () => void;
}
```

### Store Methods

```typescript
interface TableFiltersAndSorterStore {
  filtersAndSorterConfig: Record<string, FiltersAndSorterState>;
  setFiltersAndSorterConfig: (tableId: string, config: FiltersAndSorterState) => void;
  resetFiltersAndSorterConfig: (tableId: string, defaultConfig: FiltersAndSorterState) => void;
  setFilters: (tableId: string, filters: FilterState) => void;
  setSorter: (tableId: string, sorter: SortState) => void;
  clearFilters: (tableId: string) => void;
  clearSorter: (tableId: string) => void;
  clearAll: (tableId: string) => void;
}
```

## Lưu trữ

- **Key localStorage**: `table-filters-sorter-storage`
- **Dữ liệu lưu**: filters và sorter cho từng tableId
- **Tự động khôi phục**: Khi reload trang, trạng thái sẽ được khôi phục từ localStorage

## Test

Xem file `test-filters-sorter-store.tsx` để biết cách sử dụng và test store này.

## So sánh với các store khác

| Store | Mục đích | Key localStorage |
|-------|----------|------------------|
| `useTableSearchStore` | Quản lý search term, search mode, visible columns | `table-search-storage` |
| `useTablePaginationStore` | Quản lý pagination config | `table-pagination-storage` |
| `useTableFiltersAndSorterStore` | Quản lý filters và sorter | `table-filters-sorter-storage` |

## Lưu ý

1. Store này độc lập với các store khác, có thể sử dụng riêng lẻ hoặc kết hợp
2. Mỗi table cần có `tableId` duy nhất để tránh xung đột
3. Khi `saveUserPreferences = false`, trạng thái chỉ lưu trong session, không persist
4. Store tự động merge với default config khi khôi phục từ localStorage