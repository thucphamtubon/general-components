# Table Section - Single Responsibility Principle Migration Guide

## 🎯 Tổng quan

Table section đã được refactor theo nguyên tắc **Single Responsibility Principle (SRP)** để:

- **Tách biệt trách nhiệm**: Mỗi hook/service chỉ làm một việc duy nhất
- **Dễ test**: Logic được tách thành các unit nhỏ, dễ test riêng lẻ
- **Dễ bảo trì**: Thay đổi một chức năng không ảnh hưởng đến chức năng khác
- **Tái sử dụng**: Các hooks có thể được dùng độc lập cho các use case khác

## 🏗️ Kiến trúc mới

### Specialized Hooks (Hooks chuyên biệt)

1. **`useTableSearch`** - Chỉ xử lý tìm kiếm
2. **`useTableSelection`** - Chỉ xử lý selection 
3. **`useTablePagination`** - Chỉ xử lý phân trang
4. **`useTableState`** - Chỉ xử lý loading/error states
5. **`useTableOrchestrator`** - Orchestrator kết hợp các hooks

### Specialized Services

1. **`search.service.ts`** - Chỉ xử lý logic search
2. **`column.service.ts`** - Chỉ xử lý cấu hình columns

### Enhanced Components

1. **`EnhancedAppTable`** - Component mới theo SRP

## 🚀 Cách sử dụng

### 1. Enhanced AppTable (Đơn giản nhất)

```tsx
import { EnhancedAppTable } from 'general-components/table-section';

function MyTableScreen() {
  const [data, setData] = useState([]);
  
  return (
    <EnhancedAppTable
      constants={TABLE_CONSTANTS}
      data={data}
      rowKey="id"
      enableSearch={true}
      enableSelection={true}
      enablePagination={true}
      onSelectionChange={(keys, rows) => {
        console.log('Selected:', keys, rows);
      }}
      onPageChange={(page, pageSize) => {
        console.log('Page changed:', page, pageSize);
      }}
    />
  );
}
```

### 2. Sử dụng Orchestrator Hook

```tsx
import { 
  useTableOrchestrator,
  Table 
} from 'general-components/table-section';

function CustomTableScreen() {
  const [data, setData] = useState([]);
  
  const table = useTableOrchestrator({
    constants: TABLE_CONSTANTS,
    data,
    enableSearch: true,
    enableSelection: true,
    onSelectionChange: (keys, rows) => {
      // Handle selection
    }
  });

  return (
    <div>
      {/* Custom search */}
      <input 
        value={table.search.searchText}
        onChange={(e) => table.search.setSearchText(e.target.value)}
        placeholder="Tìm kiếm..."
      />
      
      {/* Selection info */}
      {table.selection.hasSelection && (
        <div>Đã chọn: {table.selection.selectedRowKeys.length}</div>
      )}
      
      {/* Table */}
      <Table
        columns={table.columns}
        dataSource={table.displayData}
        pagination={table.pagination.getPaginationConfig()}
        rowSelection={table.selection.getRowSelection('id')}
        loading={table.state.loading}
      />
    </div>
  );
}
```

### 3. Sử dụng từng Hook riêng lẻ

```tsx
import { 
  useTableSearch,
  useTableSelection,
  useTablePagination,
  generateColumns 
} from 'general-components/table-section';

function AdvancedTableScreen() {
  const [data, setData] = useState([]);
  
  // Chỉ sử dụng search
  const search = useTableSearch();
  
  // Chỉ sử dụng selection
  const selection = useTableSelection({
    onSelectionChange: (keys, rows) => {
      console.log('Selection changed:', keys, rows);
    }
  });
  
  // Chỉ sử dụng pagination
  const pagination = useTablePagination({
    initialPageSize: 20,
    onPageChange: (page, size) => {
      console.log('Page changed:', page, size);
    }
  });
  
  // Generate columns
  const columns = useMemo(() => {
    return generateColumns(TABLE_CONSTANTS);
  }, []);
  
  // Filter data
  const filteredData = useMemo(() => {
    const searchableFields = ['name', 'email']; // Define searchable fields
    return search.filterBySearch(data, searchableFields);
  }, [data, search]);
  
  // Paginate data
  const paginatedData = pagination.getPaginatedData(filteredData);
  
  return (
    <div>
      {/* Custom UI components */}
      <YourCustomSearchComponent 
        value={search.searchText}
        onChange={search.setSearchText}
      />
      
      <YourCustomSelectionComponent 
        selectedCount={selection.selectedRowKeys.length}
        onClear={selection.clearSelection}
      />
      
      <Table
        columns={columns}
        dataSource={paginatedData}
        pagination={pagination.getPaginationConfig()}
        rowSelection={selection.getRowSelection('id')}
      />
    </div>
  );
}
```

## 🔄 Migration từ AppTable cũ

### Before (AppTable cũ)

```tsx
<AppTable 
  constants={TABLE_CONSTANTS}
  datas={data}  // ⚠️ 'datas' prop
  tableId="my-table"
  modalId="my-modal"
  // Nhiều props phức tạp khác...
/>
```

### After (EnhancedAppTable mới)

```tsx
<EnhancedAppTable
  constants={TABLE_CONSTANTS}
  data={data}  // ✅ 'data' prop (chuẩn hóa)
  rowKey="id"
  enableSearch={true}
  enableSelection={true}
  enablePagination={true}
  // Props đơn giản, rõ ràng hơn
/>
```

## 🧪 Testing

### Test từng hook riêng lẻ

```tsx
// test/useTableSearch.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useTableSearch } from '../hooks/useTableSearch';

describe('useTableSearch', () => {
  it('should filter data correctly', () => {
    const { result } = renderHook(() => useTableSearch());
    const data = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ];
    
    act(() => {
      result.current.setSearchText('John');
    });
    
    const filtered = result.current.filterBySearch(data, ['name']);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('John Doe');
  });
});
```

## 📊 So sánh Before/After

| Khía cạnh | Before (AppTable cũ) | After (SRP approach) |
|-----------|---------------------|---------------------|
| **Trách nhiệm** | 1 component làm tất cả | Mỗi hook làm 1 việc |
| **Dòng code** | 385 dòng/file | ~80-150 dòng/file |
| **Testing** | Khó test toàn bộ | Dễ test từng phần |
| **Reusability** | Khó tái sử dụng | Hooks có thể dùng riêng |
| **Maintainability** | Khó sửa không vỡ | Sửa 1 hook không ảnh hưởng khác |
| **Bundle size** | Import cả module | Tree-shake được |

## 🎯 Best Practices

1. **Sử dụng EnhancedAppTable** cho hầu hết trường hợp
2. **Sử dụng useTableOrchestrator** khi cần custom UI
3. **Sử dụng hooks riêng lẻ** khi chỉ cần 1-2 chức năng cụ thể
4. **Giữ backward compatibility** bằng cách vẫn export AppTable cũ

## 🔗 Backward Compatibility

Table section cũ vẫn hoạt động bình thường:

```tsx
// Vẫn hoạt động
import { AppTable, useTable, TableProvider } from 'general-components/table-section';
```

## 📝 Kết luận

Việc refactor theo SRP giúp:
- **Code dễ hiểu** - Mỗi file có trách nhiệm rõ ràng
- **Test dễ hơn** - Test từng hook riêng lẻ
- **Maintain dễ hơn** - Sửa 1 chỗ không sợ làm hỏng chỗ khác
- **Performance tốt hơn** - Tree-shaking, chỉ import những gì cần

Đây là ví dụ điển hình của việc áp dụng SOLID principles trong React development! 