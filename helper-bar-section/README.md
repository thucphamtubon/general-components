# Helper Bar Component

Một thanh công cụ đa năng với nhiều chế độ hiển thị khác nhau, hỗ trợ tìm kiếm, lọc và các hành động thông thường.

## Cài đặt

```bash
# Nếu cần cài đặt các dependencies
# npm install @ant-design/icons
```

## Cách sử dụng

```tsx
import { HelperBar } from '@/general-components/helper-bar-section';
import { useState } from 'react';

const ExamplePage = () => {
  const [mode, setMode] = useState<'filter' | 'search' | 'actions'>('filter');

  return (
    <div>
      <HelperBar 
        mode={mode}
        onModeChange={setMode}
        onSearch={(value) => console.log('Search:', value)}
        searchPlaceholder="Tìm kiếm..."
        // Các props khác...
      />
      {/* Nội dung của bạn */}
    </div>
  );
};
```

## Props

| Prop | Type | Mặc định | Mô tả |
|------|------|-----------|-------------|
| mode | 'filter' \| 'search' \| 'actions' | 'filter' | Chế độ hiển thị của thanh công cụ |
| onModeChange | (mode: string) => void | - | Callback khi chuyển đổi chế độ |
| onSearch | (value: string) => void | - | Callback khi thực hiện tìm kiếm |
| onFilterClick | () => void | - | Callback khi nhấn nút lọc |
| onSettingsClick | () => void | - | Callback khi nhấn nút cài đặt |
| onRefresh | () => void | - | Callback khi nhấn nút làm mới |
| onAdd | () => void | - | Callback khi nhấn nút thêm mới |
| onDownload | () => void | - | Callback khi nhấn nút xuất file |
| onUpload | () => void | - | Callback khi nhấn nút nhập file |
| onDelete | () => void | - | Callback khi nhấn nút xóa |
| searchPlaceholder | string | 'Tìm kiếm...' | Placeholder cho ô tìm kiếm |
| className | string | '' | Class CSS tùy chỉnh |

## Các chế độ hiển thị

1. **Chế độ bộ lọc (Filter Mode)**: Hiển thị các nút tìm kiếm, bộ lọc, cài đặt và làm mới.
2. **Chế độ tìm kiếm (Search Mode)**: Hiển thị ô tìm kiếm với nút tìm kiếm.
3. **Chế độ hành động (Actions Mode)**: Hiển thị các nút hành động chính như thêm mới, xuất/nhập file, xóa.

## Tùy chỉnh giao diện

Bạn có thể ghi đè các style mặc định bằng cách thêm class CSS tùy chỉnh thông qua prop `className` hoặc ghi đè các class CSS trong file `helper-bar.less`.
