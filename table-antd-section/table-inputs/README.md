# Table Input Components

Bộ input components tối ưu hiệu suất cho table cells, sử dụng HTML input mặc định thay vì Antd.

## Đặc điểm

- **Hiệu suất cao**: Sử dụng HTML input mặc định, không phụ thuộc vào Antd
- **Tích hợp table**: Được thiết kế riêng cho table cells
- **DRY principle**: Shared hooks và utilities
- **TypeScript**: Đầy đủ type safety
- **Lightweight**: Bundle size nhỏ

## Cấu trúc

```
table-inputs/
├── components/          # Input components
├── shared/             # Shared hooks, types, utils
├── styles/             # CSS styles
└── index.ts           # Public exports
```

## Sử dụng

```tsx
import { TableInputText, TableInputNumber } from '../table-inputs';

// Trong table column render
render: (value, row, index) => (
  <TableInputText
    value={value}
    onChange={(newValue) => handleChange(newValue, row, index)}
    placeholder="Nhập text"
  />
)
```