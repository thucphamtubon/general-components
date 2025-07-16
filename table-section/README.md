# Table Section

Một module table component được tối ưu hóa với cấu trúc export rõ ràng, tránh trùng lặp và dễ sử dụng.

## Cấu trúc thư mục

```
table-section/
├── components/          # Các component chính
│   ├── AppTable.tsx    # Component table chính với đầy đủ tính năng
│   ├── MyTable.tsx     # Component table cơ bản
│   ├── SummaryTable.tsx # Component hiển thị summary
│   └── index.ts        # Export components
├── hooks/              # React hooks
│   ├── useTable.tsx    # Hook quản lý table context
│   └── index.ts        # Export hooks
├── services/           # Business logic
│   ├── table.services.tsx # Xử lý columns, search, filter
│   └── index.ts        # Export services
├── types/              # TypeScript definitions
│   ├── Table.types.ts  # Tất cả type definitions
│   └── index.ts        # Export types
├── utils/              # Utility functions
│   ├── Table.logics.ts # Helper functions, state management
│   └── index.ts        # Export utilities
└── index.ts            # Main export file
```

## Cách sử dụng

### Import components
```typescript
import { AppTable, MyTable, SummaryTable } from './table-section';
```

### Import hooks
```typescript
import { useTable, TableProvider, useSearchText } from './table-section';
```

### Import types
```typescript
import type { IConstants, ActionsReturn, TableContextType } from './table-section';
```

### Import utilities
```typescript
import { xoaDauVietNam, useStates, thongBaoQuyenChinhSua } from './table-section';
```

## Tính năng chính

### AppTable
- Component table đầy đủ tính năng
- Hỗ trợ search, filter, sort
- Pagination tự động
- Row selection
- Expandable rows
- Custom actions

### MyTable
- Component table cơ bản
- Wrapper cho Antd Table
- Pagination tùy chỉnh
- Responsive design

### SummaryTable
- Hiển thị summary data
- Tính toán tự động
- Custom styling

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