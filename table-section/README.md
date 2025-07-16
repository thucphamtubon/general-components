# Table Section

Một module table component được tối ưu hóa với cấu trúc export rõ ràng, tránh trùng lặp và dễ sử dụng.

## Cấu trúc thư mục

```
table-section/
├── components/          # Các component chính
│   ├── EnhancedAppTable/    # Component table chính (refactored)
│   │   ├── EnhancedAppTable.tsx
│   │   ├── EnhancedAppTable.less
│   │   └── index.ts
│   ├── TableHeader/         # Header với search và selection
│   │   ├── TableHeader.tsx
│   │   ├── TableHeader.less
│   │   └── index.ts
│   ├── TableSearchBar/      # Search functionality
│   │   ├── TableSearchBar.tsx
│   │   ├── TableSearchBar.less
│   │   └── index.ts
│   ├── TableSelectionInfo/  # Selection information
│   │   ├── TableSelectionInfo.tsx
│   │   ├── TableSelectionInfo.less
│   │   └── index.ts
│   ├── SummaryTable.tsx     # Component hiển thị summary
│   └── index.ts            # Export components
├── hooks/              # React hooks (SRP-based)
│   ├── useTable.tsx          # Hook quản lý table context (legacy)
│   ├── useTableSearch.ts     # Chuyên xử lý search
│   ├── useTableSelection.ts  # Chuyên xử lý selection
│   ├── useTablePagination.ts # Chuyên xử lý pagination
│   ├── useTableState.ts      # Chuyên xử lý state
│   ├── useTableOrchestrator.ts # Kết hợp các hooks
│   └── index.ts             # Export hooks
├── services/           # Business logic (SRP-based)
│   ├── table.services.tsx   # Legacy service
│   ├── search.service.ts    # Chuyên xử lý search logic
│   ├── column-service/      # Chuyên xử lý columns
│   │   ├── generateColumns.ts
│   │   ├── transformColumn.ts
│   │   └── index.ts
│   └── index.ts            # Export services
├── types/              # TypeScript definitions
│   ├── Table.types.ts  # Tất cả type definitions
│   └── index.ts        # Export types
├── utils/              # Utility functions
│   ├── Table.logics.ts # Helper functions, state management
│   └── index.ts        # Export utilities
├── table-inputs/       # Input components tối ưu cho table
│   ├── components/     # TableInputText, Number, Select, etc.
│   ├── shared/         # Shared hooks, types, utils
│   └── styles/         # CSS styles
└── index.ts            # Main export file
```

## Cách sử dụng

### Import components
```typescript
import { 
  EnhancedAppTable, 
  SummaryTable,
  TableHeader,
  TableSearchBar,
  TableSelectionInfo
} from './table-section';
```

### Import hooks
```typescript
import { 
  useTable, 
  TableProvider, 
  useTableSearch,
  useTableSelection,
  useTablePagination,
  useTableOrchestrator
} from './table-section';
```

### Import types
```typescript
import type { 
  IConstants, 
  ActionsReturn, 
  TableContextType,
  EnhancedAppTableProps,
  TableHeaderProps
} from './table-section';
```

### Import utilities
```typescript
import { xoaDauVietNam, useStates, thongBaoQuyenChinhSua } from './table-section';
```

## Tính năng chính

### EnhancedAppTable (Refactored)
- Component table đầy đủ tính năng theo SRP
- Hỗ trợ search, filter, sort
- Pagination tự động
- Row selection với external control
- Striped rows và sticky headers
- Performance optimization với useMemo
- Accessibility compliant

### TableHeader
- Kết hợp search và selection components
- Responsive layout options
- Live regions cho screen readers
- Custom content support

### TableSearchBar
- Dedicated search functionality
- Keyboard shortcuts (Escape to clear)
- Customizable placeholder và styling
- Accessibility support

### TableSelectionInfo
- Hiển thị thông tin selection
- Auto-hide khi không có selection
- Multiple color themes
- Clear all functionality

### SummaryTable
- Hiển thị summary data
- Tính toán tự động
- Custom styling

### Specialized Hooks
- `useTableSearch`: Chỉ xử lý search logic
- `useTableSelection`: Chỉ xử lý selection logic
- `useTablePagination`: Chỉ xử lý pagination logic
- `useTableOrchestrator`: Kết hợp tất cả hooks

## Ưu điểm của cấu trúc mới

1. **Explicit exports**: Tất cả exports đều rõ ràng, không sử dụng `export *`
2. **Tránh trùng lặp**: Loại bỏ các re-export không cần thiết
3. **Type safety**: Sử dụng `export type` cho TypeScript types
4. **Dễ debug**: Dễ dàng trace được source của từng export
5. **Tree shaking**: Hỗ trợ tốt hơn cho bundler optimization
6. **Maintainable**: Cấu trúc rõ ràng, dễ bảo trì

## Migration Guide

Nếu bạn đang sử dụng version cũ:

```typescript
// Cũ - có thể gây conflict
import * from './table-section';

// Mới - explicit và safe
import { AppTable, useTable, IConstants } from './table-section';
```

## Best Practices

1. Luôn import những gì bạn cần, tránh import toàn bộ module
2. Sử dụng type imports cho TypeScript types
3. Sử dụng TableProvider ở root level của ứng dụng
4. Customize table thông qua constants và actions props