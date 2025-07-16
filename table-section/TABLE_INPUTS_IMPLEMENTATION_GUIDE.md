# Table Inputs Implementation Guide

Hướng dẫn chi tiết cách implement và sử dụng Table Input Components trong table-section.

## 📋 Tổng quan

Table Input Components là bộ input components được tối ưu hiệu suất cho table cells, sử dụng HTML input mặc định thay vì Antd để đạt hiệu suất cao nhất.

### Đặc điểm chính

- **Hiệu suất cao**: Sử dụng HTML input mặc định, không phụ thuộc vào Antd
- **Tích hợp table**: Được thiết kế riêng cho table cells
- **DRY principle**: Shared hooks và utilities
- **TypeScript**: Đầy đủ type safety
- **Lightweight**: Bundle size nhỏ
- **Debounce**: Tối ưu performance với debounce onChange
- **Validation**: Built-in validation system
- **Accessibility**: Hỗ trợ đầy đủ ARIA attributes

## 🏗️ Cấu trúc Module

```
table-inputs/
├── components/          # Input components
│   ├── TableInputText.tsx
│   ├── TableInputNumber.tsx
│   ├── TableInputSelect.tsx
│   ├── TableInputDate.tsx
│   ├── TableInputTextArea.tsx
│   ├── TableInputSwitch.tsx
│   └── index.ts
├── shared/             # Shared hooks, types, utils
│   ├── hooks.ts        # useTableInput, useInputFocus, etc.
│   ├── types.ts        # TypeScript definitions
│   ├── utils.ts        # Validation, formatting utilities
│   └── index.ts
├── demo/               # Demo component
│   └── TableInputsDemo.tsx
├── styles/             # CSS styles
│   └── table-inputs.css
└── index.ts           # Public exports
```

## 🚀 Cách sử dụng

### 1. Import Components

```typescript
import {
  TableInputText,
  TableInputNumber,
  TableInputSelect,
  TableInputDate,
  TableInputTextArea,
  TableInputSwitch
} from 'general-components/table-section/table-inputs';

// Import types
import type {
  ITableInputTextProps,
  ITableInputNumberProps,
  ISelectOption
} from 'general-components/table-section/table-inputs';
```

### 2. Sử dụng trong Table Column Render

```typescript
// Trong table column definition
const columns = [
  {
    title: 'Tên',
    dataIndex: 'name',
    render: (value: string, row: any, index: number) => (
      <TableInputText
        value={value}
        onChange={(newValue) => handleCellChange(index, 'name', newValue)}
        placeholder="Nhập tên..."
        row={row}
        index={index}
        field="name"
      />
    )
  },
  {
    title: 'Tuổi',
    dataIndex: 'age',
    render: (value: number, row: any, index: number) => (
      <TableInputNumber
        value={value}
        onChange={(newValue) => handleCellChange(index, 'age', newValue)}
        min={18}
        max={65}
        placeholder="Tuổi"
        row={row}
        index={index}
        field="age"
      />
    )
  }
];
```

### 3. Handler Function

```typescript
const handleCellChange = (rowIndex: number, field: string, value: any) => {
  setData(prevData => 
    prevData.map((row, index) => 
      index === rowIndex ? { ...row, [field]: value } : row
    )
  );
};
```

## 📝 Component API

### TableInputText

```typescript
interface ITableInputTextProps extends IBaseTableInputProps {
  type?: 'text' | 'email' | 'url' | 'tel';
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  spellCheck?: boolean;
}
```

**Ví dụ:**
```tsx
<TableInputText
  value={row.email}
  onChange={(value) => handleChange(index, 'email', value)}
  type="email"
  placeholder="email@example.com"
  maxLength={100}
  row={row}
  index={index}
  field="email"
/>
```

### TableInputNumber

```typescript
interface ITableInputNumberProps extends IBaseTableInputProps {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  allowMath?: boolean;
  formatter?: (value: number | string) => string;
  parser?: (value: string) => number;
}
```

**Ví dụ:**
```tsx
<TableInputNumber
  value={row.price}
  onChange={(value) => handleChange(index, 'price', value)}
  min={0}
  precision={2}
  allowMath={true}
  placeholder="0.00"
  row={row}
  index={index}
  field="price"
/>
```

### TableInputSelect

```typescript
interface ITableInputSelectProps extends IBaseTableInputProps {
  options: ISelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

interface ISelectOption {
  label: string;
  value: any;
  disabled?: boolean;
  group?: string;
}
```

**Ví dụ:**
```tsx
const categoryOptions: ISelectOption[] = [
  { value: 'developer', label: 'Lập trình viên' },
  { value: 'designer', label: 'Thiết kế' },
  { value: 'manager', label: 'Quản lý' }
];

<TableInputSelect
  value={row.category}
  onChange={(value) => handleChange(index, 'category', value)}
  options={categoryOptions}
  searchable
  clearable
  placeholder="Chọn chức vụ..."
  row={row}
  index={index}
  field="category"
/>
```

### TableInputDate

```typescript
interface ITableInputDateProps extends IBaseTableInputProps {
  format?: string;
  showTime?: boolean;
  timeFormat?: string;
  min?: string;
  max?: string;
  minDate?: string;
  maxDate?: string;
}
```

**Ví dụ:**
```tsx
<TableInputDate
  value={row.birthDate}
  onChange={(value) => handleChange(index, 'birthDate', value)}
  format="dd/MM/yyyy"
  placeholder="dd/MM/yyyy"
  max={new Date().toISOString().split('T')[0]}
  row={row}
  index={index}
  field="birthDate"
/>
```

### TableInputTextArea

```typescript
interface ITableInputTextAreaProps extends IBaseTableInputProps {
  rows?: number;
  cols?: number;
  minLength?: number;
  maxLength?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  autoResize?: boolean;
}
```

**Ví dụ:**
```tsx
<TableInputTextArea
  value={row.description}
  onChange={(value) => handleChange(index, 'description', value)}
  rows={3}
  maxLength={500}
  autoResize
  placeholder="Mô tả..."
  row={row}
  index={index}
  field="description"
/>
```

### TableInputSwitch

```typescript
interface ITableInputSwitchProps extends IBaseTableInputProps {
  checked?: boolean;
  checkedValue?: any;
  uncheckedValue?: any;
  size?: 'small' | 'medium' | 'large';
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  loading?: boolean;
}
```

**Ví dụ:**
```tsx
<TableInputSwitch
  value={row.isActive}
  onChange={(value) => handleChange(index, 'isActive', value)}
  checkedChildren="ON"
  unCheckedChildren="OFF"
  size="small"
  row={row}
  index={index}
  field="isActive"
/>
```

## 🔧 Advanced Features

### 1. Validation

```typescript
import { useTableInput } from 'general-components/table-section/table-inputs';

const CustomInput = ({ value, onChange }) => {
  const {
    displayValue,
    isValid,
    errorMessage,
    handleChange
  } = useTableInput({
    initialValue: value,
    onChange,
    validation: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Tên chỉ được chứa chữ cái và khoảng trắng'
    },
    debounceMs: 300
  });

  return (
    <>
      <input
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        className={!isValid ? 'error' : ''}
      />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </>
  );
};
```

### 2. Custom Formatter/Parser

```typescript
<TableInputNumber
  value={row.price}
  onChange={(value) => handleChange(index, 'price', value)}
  formatter={(value) => `${value} VNĐ`}
  parser={(value) => parseFloat(value.replace(' VNĐ', ''))}
  precision={0}
  row={row}
  index={index}
  field="price"
/>
```

### 3. Math Expression Support

```typescript
<TableInputNumber
  value={row.quantity}
  onChange={(value) => handleChange(index, 'quantity', value)}
  allowMath={true} // Cho phép nhập biểu thức như "10+5", "20*2"
  placeholder="Nhập số hoặc phép tính..."
  row={row}
  index={index}
  field="quantity"
/>
```

## 🎨 Styling

### CSS Classes

```css
/* Base classes */
.table-input {
  /* Base input styles */
}

.table-input-text {
  /* Text input specific styles */
}

.table-input-number {
  /* Number input specific styles */
}

/* States */
.table-input.focused {
  /* Focused state */
}

.table-input.error {
  /* Error state */
}

.table-input.disabled {
  /* Disabled state */
}

/* Error message */
.table-input-error-message {
  /* Error message styles */
}
```

### Custom Styling

```tsx
<TableInputText
  value={value}
  onChange={onChange}
  className="custom-input"
  style={{
    backgroundColor: '#f0f0f0',
    border: '2px solid #007bff',
    borderRadius: '4px'
  }}
/>
```

## 🔍 Best Practices

### 1. Performance Optimization

```typescript
// Sử dụng useCallback cho handlers
const handleCellChange = useCallback((rowIndex: number, field: string, value: any) => {
  setData(prevData => 
    prevData.map((row, index) => 
      index === rowIndex ? { ...row, [field]: value } : row
    )
  );
}, []);

// Sử dụng useMemo cho options
const categoryOptions = useMemo(() => [
  { value: 'developer', label: 'Lập trình viên' },
  { value: 'designer', label: 'Thiết kế' }
], []);
```

### 2. Accessibility

```tsx
<TableInputText
  value={value}
  onChange={onChange}
  aria-label="Tên nhân viên"
  aria-describedby="name-help"
  data-testid="employee-name-input"
/>
```

### 3. Error Handling

```typescript
const handleCellChange = (rowIndex: number, field: string, value: any) => {
  try {
    // Validate value
    if (field === 'email' && !isValidEmail(value)) {
      throw new Error('Email không hợp lệ');
    }
    
    setData(prevData => 
      prevData.map((row, index) => 
        index === rowIndex ? { ...row, [field]: value } : row
      )
    );
  } catch (error) {
    console.error('Error updating cell:', error);
    // Show error notification
  }
};
```

## 📱 Responsive Design

```css
/* Mobile responsive */
@media (max-width: 768px) {
  .table-input {
    font-size: 16px; /* Prevent zoom on iOS */
    min-height: 44px; /* Touch target size */
  }
}
```

## 🧪 Testing

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react';
import { TableInputText } from '../components/TableInputText';

test('should update value on change', async () => {
  const handleChange = jest.fn();
  const { getByTestId } = render(
    <TableInputText
      value="initial"
      onChange={handleChange}
      data-testid="text-input"
    />
  );
  
  const input = getByTestId('text-input');
  fireEvent.change(input, { target: { value: 'new value' } });
  
  await waitFor(() => {
    expect(handleChange).toHaveBeenCalledWith('new value');
  });
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Performance Issues**
   - Sử dụng `useCallback` cho onChange handlers
   - Tăng debounceMs nếu cần
   - Tránh re-render không cần thiết

2. **Validation Not Working**
   - Kiểm tra validation rules
   - Đảm bảo onValidation callback được set

3. **Styling Issues**
   - Import CSS file: `import '../styles/table-inputs.css'`
   - Kiểm tra CSS specificity

## 📚 Examples

Xem file demo đầy đủ tại: `table-inputs/demo/TableInputsDemo.tsx`

## 🔗 Related

- [Table Section README](./README.md)
- [SRP Migration Guide](./SRP_MIGRATION_GUIDE.md)
- [Enhanced AppTable](./components/EnhancedAppTable.tsx)

---

**Lưu ý**: Table Input Components được thiết kế để tối ưu hiệu suất trong table cells. Nếu bạn cần input components cho form thông thường, hãy sử dụng `input-section` module.