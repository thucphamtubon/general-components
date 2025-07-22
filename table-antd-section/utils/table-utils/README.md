# Table Utilities Documentation (Table-utils)

Table-utils là tập hợp các tiện ích để làm việc với bảng dữ liệu trong Ant Design. Module này cung cấp các chức năng để thao tác với columns, filtering, searching và các tiện ích cơ bản khác.

## Cấu trúc thư mục

```
table-utils/
├── columns/    - Tiện ích để làm việc với cột trong bảng
├── core/       - Các tiện ích cốt lõi cho table
├── filtering/  - Tiện ích để lọc dữ liệu
├── search/     - Tiện ích để tìm kiếm dữ liệu
└── index.ts    - Export tất cả các module
```

## Hướng dẫn sử dụng

### 1. Core Utilities

Các tiện ích cơ bản cho bảng:

#### `hasChildren<T>(column)`
- **Công dụng**: Kiểm tra một column có children hay không (là ColumnGroupType).
- **Khi nào sử dụng**: Khi bạn cần kiểm tra một cột có phải là nhóm cột hay không.

#### `filterColumnsByBreakpointExclusion<T>(columns, breakpoint)`
- **Công dụng**: Lọc các cột theo breakpoint (loại trừ), trả về mảng cột mới không chứa các cột bị ẩn ở breakpoint đó.
- **Khi nào sử dụng**: Khi bạn muốn ẩn một số cột trong bảng dựa trên kích thước màn hình (responsive).
- **Cách dùng**: Sử dụng cho responsive nhưng khác với `getResponsiveColumns`, đây là phương pháp loại trừ (sẽ ẩn cột nếu breakpoint nằm trong danh sách responsive).

#### `compareKeyArrays(array1, array2)`
- **Công dụng**: So sánh hai mảng key, trả về true nếu giống nhau.
- **Khi nào sử dụng**: Khi bạn cần so sánh hai mảng khóa, ví dụ như khi so sánh cấu hình cột hiện tại và cấu hình cột mới.

#### `deepCloneColumns<T>(columns)`
- **Công dụng**: Clone sâu cấu trúc columns để tránh tham chiếu.
- **Khi nào sử dụng**: Khi bạn cần tạo bản sao của cấu trúc cột và thay đổi bản sao mà không ảnh hưởng đến bản gốc.

#### `applyDefaultColumnProps<T>(columns, defaultProps)`
- **Công dụng**: Áp dụng các thuộc tính mặc định cho tất cả các cột.
- **Khi nào sử dụng**: Khi bạn muốn đặt các thuộc tính chung cho nhiều cột (như width, align, ellipsis, etc.) một cách hiệu quả.

### 2. Columns Utilities

Các tiện ích để làm việc với cột trong bảng:

#### `getResponsiveColumns<T>(columns, breakpoint)`
- **Công dụng**: Lọc các cột hiển thị theo breakpoint hiện tại (responsive).
- **Khi nào sử dụng**: Khi bạn cần hiển thị một tập cột khác nhau dựa trên kích thước màn hình.
- **Cách dùng**: Column phải có thuộc tính `responsive` là một mảng các breakpoint, và cột sẽ hiển thị nếu breakpoint hiện tại nằm trong mảng đó.

#### `cloneColumns<T>(columns)`
- **Công dụng**: Clone sâu định nghĩa cột để tránh lỗi tham chiếu.
- **Khi nào sử dụng**: Khi bạn cần một bản sao của cấu trúc cột để thực hiện thay đổi mà không ảnh hưởng đến bản gốc.

#### `applyColumnDefaults<T>(columns, defaults)`
- **Công dụng**: Thêm các thuộc tính mặc định cho tất cả các cột.
- **Khi nào sử dụng**: Tương tự như `applyDefaultColumnProps` từ core, nhưng với xử lý hơi khác cho column groups.

#### `findColumnByKey<T>(columns, key)`
- **Công dụng**: Tìm column definition theo key hoặc dataIndex.
- **Khi nào sử dụng**: Khi bạn cần tìm cấu hình của một cột cụ thể dựa trên key hoặc dataIndex.

### 3. Filtering Utilities

Các tiện ích để lọc dữ liệu:

#### `applyColumnFilters<T>(data, filters, columns)`
- **Công dụng**: Áp dụng column filters lên dữ liệu.
- **Khi nào sử dụng**: Khi bạn cần lọc dữ liệu bảng dựa trên bộ lọc do người dùng đặt (thông qua column filters của Ant Design).
- **Cách hoạt động**: Sử dụng `onFilter` từ column definition nếu có, nếu không thì thực hiện so sánh trực tiếp.

### 4. Search Utilities

Các tiện ích để tìm kiếm dữ liệu:

#### `filterDataBySearchTerm<T>(data, searchTerm, searchableColumns, searchMode)`
- **Công dụng**: Lọc dữ liệu theo từ khóa tìm kiếm trên các trường có thể tìm kiếm.
- **Khi nào sử dụng**: Khi bạn cần thực hiện tìm kiếm global trên dữ liệu bảng.
- **Tùy chọn**: 
  - Chỉ định `searchableColumns` để giới hạn phạm vi tìm kiếm
  - Chỉ định `searchMode` để điều chỉnh cách so sánh (phân biệt hoa thường, v.v.)

#### `getSearchableColumnKeys<T>(columns)`
- **Công dụng**: Lấy danh sách key của các cột có thể tìm kiếm (có thuộc tính searchable).
- **Khi nào sử dụng**: Khi bạn cần xác định trước những cột nào sẽ được sử dụng cho tìm kiếm.

## Tình huống sử dụng phổ biến

1. **Responsive Table**:
   ```typescript
   // Sử dụng getResponsiveColumns khi muốn hiển thị cột theo breakpoint
   const visibleColumns = getResponsiveColumns(columns, 'md');
   
   // Hoặc sử dụng filterColumnsByBreakpointExclusion khi muốn ẩn cột ở breakpoint nào đó
   const filteredColumns = filterColumnsByBreakpointExclusion(columns, 'sm');
   ```

2. **Tùy chỉnh nhiều cột cùng lúc**:
   ```typescript
   // Sử dụng applyDefaultColumnProps/applyColumnDefaults để thiết lập thuộc tính chung
   const enhancedColumns = applyColumnDefaults(columns, { 
     ellipsis: true,
     width: 120,
     align: 'center'
   });
   ```

3. **Tìm kiếm và lọc dữ liệu**:
   ```typescript
   // Lọc dữ liệu theo bộ lọc cột
   const filteredData = applyColumnFilters(data, filters, columns);
   
   // Tìm kiếm dữ liệu
   const searchableColumns = getSearchableColumnKeys(columns);
   const searchResults = filterDataBySearchTerm(data, searchTerm, searchableColumns);
   ```

## Lưu ý quan trọng

1. Các hàm clone như `deepCloneColumns` và `cloneColumns` sẽ tạo ra bản sao hoàn toàn mới, hãy chỉ sử dụng khi cần thiết để tránh tạo ra bản sao không cần thiết ảnh hưởng đến hiệu suất.

2. Nhiều hàm tương tự nhau giữa các modules (như `deepCloneColumns` và `cloneColumns`). Nên ưu tiên sử dụng hàm từ module phù hợp nhất với mục đích của bạn.

3. Các hàm filter đều trả về mảng mới và không làm thay đổi mảng đầu vào.

4. Đừng quên type parameter `<T>` khi sử dụng các hàm này để TypeScript có thể hỗ trợ bạn tốt hơn.
