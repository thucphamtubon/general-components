# Hướng Dẫn Tổ Chức Types trong Table-Antd-Section

> Tài liệu này cung cấp hướng dẫn về cách tổ chức và sắp xếp các types trong thư mục `types` theo nguyên tắc DRY (Don't Repeat Yourself) và SRP (Single Responsibility Principle).

## Cấu trúc thư mục

```
types/
├── base.types.ts     - Các type cơ bản và kế thừa từ thư viện
├── props.types.ts    - Props của components
├── state.types.ts    - States và trạng thái
├── config.types.ts   - Cấu hình
├── hooks.types.ts    - Types cho hooks
├── options.types.ts  - Tùy chọn
├── export.types.ts   - Types liên quan xuất dữ liệu
├── table-utils.types.ts - Types cho utilities
└── index.ts         - Re-export tất cả các types
```

## Nguyên tắc phân loại files

| File               | Mục đích                                                           | Ví dụ                                  |
|--------------------|--------------------------------------------------------------------|-----------------------------------------|
| `base.types.ts`    | Các type cơ bản được dùng nhiều nơi, types kế thừa từ thư viện    | `TableRecord`, `ColumnType`            |
| `props.types.ts`   | Props của components (nhận vào từ bên ngoài)                       | `EnhancedTableProps`, `TableProps`     |
| `state.types.ts`   | Các types liên quan đến state (lưu trữ trạng thái nội bộ)          | `PaginationState`, `TableState`        |
| `config.types.ts`  | Cấu hình cố định hoặc ít thay đổi                                 | `TableConfig`, `TableContextType`      |
| `hooks.types.ts`   | Types liên quan đến custom hooks                                   | `UseTableProps`, `TableHookResult`     |
| `options.types.ts` | Các tùy chọn cho người dùng hoặc developer                        | `TablePaginationOptions`               |
| `table-utils.types.ts` | Types cho utility functions                                   | `SearchMode`, `SortType`               |

## Quy tắc DRY (Don't Repeat Yourself)

1. **Tái sử dụng types hiện có**: Trước khi tạo type mới, kiểm tra xem có thể kế thừa hoặc mở rộng từ types hiện có không:
   ```typescript
   // Thay vì
   interface MySpecialColumn {
     title: string;
     dataIndex: string;
     hidden?: boolean;
   }
   
   // Nên sử dụng
   import { ColumnType } from './base.types';
   type MySpecialColumn = ColumnType & { specialProp: boolean };
   ```

2. **Sử dụng generic types** để tạo ra các type linh hoạt:
   ```typescript
   export interface PaginatedData<T> {
     data: T[];
     total: number;
     page: number;
     pageSize: number;
   }
   ```

3. **Tạo các type unions** khi cần thiết:
   ```typescript
   export type SortOrder = 'ascend' | 'descend' | null;
   ```

## Quy tắc SRP (Single Responsibility Principle)

1. **Mỗi file chỉ nên chứa các types liên quan đến một trách nhiệm cụ thể**:
   - `props.types.ts` chỉ nên chứa các types định nghĩa props của component
   - `state.types.ts` chỉ nên chứa các types liên quan đến state

2. **Chia nhỏ types quá lớn** thành các types nhỏ hơn, có trách nhiệm rõ ràng:
   ```typescript
   // Thay vì
   interface HugeTableConfig {
     pagination: { /* nhiều thuộc tính */ };
     sorting: { /* nhiều thuộc tính */ };
     filtering: { /* nhiều thuộc tính */ };
   }
   
   // Nên chia thành
   interface PaginationConfig { /* thuộc tính pagination */ }
   interface SortingConfig { /* thuộc tính sorting */ }
   interface FilteringConfig { /* thuộc tính filtering */ }
   
   interface TableConfig {
     pagination: PaginationConfig;
     sorting: SortingConfig;
     filtering: FilteringConfig;
   }
   ```

## Quy trình ra quyết định khi thêm type mới

Khi bạn muốn thêm một type mới, hãy trả lời các câu hỏi sau:

1. **Type này đại diện cho cái gì?**
   - Props của component → `props.types.ts`
   - State nội bộ → `state.types.ts`
   - Type cơ bản/kế thừa từ thư viện → `base.types.ts`
   - Cấu hình → `config.types.ts`
   - Liên quan đến hooks → `hooks.types.ts`
   - Tùy chọn người dùng → `options.types.ts`
   - Utility cho table → `table-utils.types.ts`

2. **Type này có tái sử dụng type hiện có không?**
   - Có → Mở rộng từ type đó
   - Không → Tạo type mới

3. **Type có quá lớn hoặc quá phức tạp không?**
   - Có → Chia nhỏ thành các sub-types có trách nhiệm rõ ràng hơn
   - Không → Giữ nguyên

4. **Type này có được sử dụng ở nhiều nơi không?**
   - Có → Đặt ở file phù hợp và export từ `index.ts`
   - Không, chỉ sử dụng cục bộ → Xem xét đặt trong file local hoặc file riêng

## Ví dụ thực tế

### Tình huống 1: Thêm một tùy chọn mới cho bảng

```typescript
// Thêm vào options.types.ts
export interface TablePaginationOptions {
  // Các options hiện tại
  enableTotalDisplay?: boolean; // Option mới
}
```

### Tình huống 2: Thêm một cột đặc biệt

```typescript
// Thêm vào base.types.ts
export interface SpecialColumnType<RecordType = TableRecord> extends ColumnType<RecordType> {
  isSpecial?: boolean;
  specialRender?: (value: any, record: RecordType) => React.ReactNode;
}
```

### Tình huống 3: Thêm props cho component mới

```typescript
// Thêm vào props.types.ts
export interface TableFilterBarProps<RecordType = TableRecord> {
  columns: ColumnsType<RecordType>;
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}
```

## Lợi ích của cách tổ chức này

- **Dễ đọc**: Mỗi file có một mục đích rõ ràng, dễ tìm kiếm
- **Dễ bảo trì**: Khi cần thay đổi một loại type, biết ngay đâu là file cần sửa
- **Tránh trùng lặp**: Sử dụng kế thừa và composition để tái sử dụng types
- **Dễ mở rộng**: Cấu trúc modular giúp dễ dàng mở rộng thêm tính năng mới
