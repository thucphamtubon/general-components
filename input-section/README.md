# Input Section Library - DRY Architecture

A comprehensive input component library for CaterSoft ReactJS applications, built with DRY (Don't Repeat Yourself) principles.

## 📁 Structure

```
input-section/
├── components/          # Input components
│   ├── InputNumberAntd.tsx
│   ├── InputTextAntd.tsx
│   ├── InputSelectAntd.tsx
│   ├── InputDateAntd.tsx
│   ├── InputTextAreaAntd.tsx
│   ├── InputSwitchAntd.tsx
│   └── index.ts
├── shared/             # Shared utilities
│   ├── types.ts        # TypeScript interfaces
│   ├── hooks.ts        # Custom hooks
│   ├── utils.ts        # Utility functions
│   └── index.ts
├── index.ts            # Main exports
└── README.md
```

## 🚀 Quick Start

### Import Components

```typescript
import {
  InputNumber,
  InputText,
  InputSelect,
  InputDate,
  InputTextArea,
  InputSwitch
} from '@/general-components'
```

### Basic Usage

#### Number Input with Math Expression Support

```typescript
<InputNumber
  cell={value}
  row={rowData}
  index={rowIndex}
  onInputed={(value, row, index) => {
    console.log('New value:', value)
  }}
  placeholder="Enter number or math expression"
  min={0}
  allowMath={true}
/>
```

#### Text Input

```typescript
<InputText
  cell={value}
  row={rowData}
  index={rowIndex}
  onInputed={(value, row, index) => {
    console.log('New value:', value)
  }}
  placeholder="Enter text"
  maxLength={100}
  showCount={true}
/>
```

#### Select Input

```typescript
const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' }
]

<InputSelect
  cell={value}
  row={rowData}
  index={rowIndex}
  options={options}
  onInputed={(value, row, index) => {
    console.log('Selected:', value)
  }}
  placeholder="Select an option"
  allowClear={true}
  showSearch={true}
/>
```

#### Date Input

```typescript
<InputDate
  cell={value}
  row={rowData}
  index={rowIndex}
  onInputed={(value, row, index) => {
    console.log('Selected date:', value)
  }}
  format="DD/MM/YYYY"
  placeholder="Select date"
/>
```

#### TextArea Input

```typescript
<InputTextArea
  cell={value}
  row={rowData}
  index={rowIndex}
  onInputed={(value, row, index) => {
    console.log('New text:', value)
  }}
  placeholder="Enter description"
  rows={4}
  maxLength={500}
  showCount={true}
/>
```

#### Switch Input

```typescript
<InputSwitch
  cell={value}
  row={rowData}
  index={rowIndex}
  onInputed={(value, row, index) => {
    console.log('Switch state:', value)
  }}
  checkedChildren="ON"
  unCheckedChildren="OFF"
/>
```

## 🔧 Advanced Usage

### Using Custom Hooks

```typescript
import { useTableInput, useInputValidation } from '@/general-components'

const MyCustomInput = ({ cell, row, index, onInputed }) => {
  const {
    value,
    handleChange,
    handleTableBlur
  } = useTableInput({
    cell,
    row,
    index,
    onInputed,
    allowMath: true
  })

  const {
    isValid,
    errorMessage,
    validate
  } = useInputValidation({
    value,
    required: true,
    validator: (val) => val > 0
  })

  return (
    <div>
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleTableBlur}
      />
      {!isValid && <span style={{color: 'red'}}>{errorMessage}</span>}
    </div>
  )
}
```

### Using Utility Functions

```typescript
import {
  evaluateMathExpression,
  formatNumber,
  createSelectOptionsFromArray,
  validators
} from '@/general-components'

// Math expression evaluation
const result = evaluateMathExpression('2 + 3 * 4') // Returns 14

// Number formatting
const formatted = formatNumber(1234.567, 2) // Returns "1234.57"

// Create select options from array
const fruits = ['Apple', 'Banana', 'Orange']
const options = createSelectOptionsFromArray(fruits)
// Returns: [{ label: 'Apple', value: 'Apple' }, ...]

// Validation
const isValidEmail = validators.email('test@example.com') // Returns true
const isPositive = validators.positiveNumber(5) // Returns true
```

## 🎨 Styling

### Using Predefined Styles

```typescript
import { inputStyles } from '@/general-components'

<InputNumber
  style={inputStyles.tableInput} // Right-aligned, full width
  // or
  style={inputStyles.centerAlign} // Center-aligned
  // or
  style={inputStyles.compactInput} // Compact padding
/>
```

### Custom Styling

```typescript
<InputText
  style={{
    width: '200px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px'
  }}
/>
```

## 📝 TypeScript Support

All components are fully typed with TypeScript interfaces:

```typescript
import type {
  INumberInputProps,
  ITextInputProps,
  ISelectInputProps,
  ISelectOption
} from '@/general-components'

const MyComponent: React.FC = () => {
  const options: ISelectOption[] = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 }
  ]

  const handleNumberInput = (value: number, row: any, index: number) => {
    // Type-safe handling
  }

  return (
    <InputNumber
      cell={0}
      row={{}}
      index={0}
      onInputed={handleNumberInput}
    />
  )
}
```

## 🔍 Features

### Math Expression Support
- InputNumber supports math expressions like `2 + 3 * 4`, `sqrt(16)`, etc.
- Powered by mathjs library
- Automatic evaluation on blur

### Table Integration
- All components are designed for table cell usage
- Consistent `cell`, `row`, `index` props
- `onInputed` callback with table context

### Validation
- Built-in validators for common cases
- Custom validation support
- Real-time validation feedback

### Accessibility
- Full keyboard navigation support
- ARIA attributes
- Screen reader friendly

### Performance
- Optimized with React.memo and useCallback
- Minimal re-renders
- Efficient state management

## 🛠️ Customization

### Creating Custom Input Components

```typescript
import { useTableInput, ITableInputProps } from '@/general-components'

interface ICustomInputProps extends ITableInputProps {
  customProp?: string
}

export const CustomInput: React.FC<ICustomInputProps> = (props) => {
  const { customProp, ...tableProps } = props
  
  const {
    value,
    handleChange,
    handleTableBlur
  } = useTableInput(tableProps)

  return (
    <div>
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleTableBlur}
      />
      {customProp && <span>{customProp}</span>}
    </div>
  )
}
```

## 📚 Best Practices

1. **Use TypeScript**: Leverage the provided types for better development experience
2. **Consistent Props**: Use the same prop structure across all table inputs
3. **Validation**: Implement validation for better user experience
4. **Performance**: Use React.memo for components that render frequently
5. **Accessibility**: Always provide meaningful placeholders and labels

## 🔄 Migration from Old InputNumberAntd

### Before (Old)
```typescript
import { InputNumberAntd } from './InputNumberAntd'

<InputNumberAntd
  cell={value}
  row={row}
  index={index}
  onInputed={handleInput}
/>
```

### After (New)
```typescript
import { InputNumber } from '@/general-components'

<InputNumber
  cell={value}
  row={row}
  index={index}
  onInputed={handleInput}
  // Now with additional features:
  allowMath={true}
  min={0}
  max={1000}
/>
```

## 🤝 Contributing

When adding new input components:

1. Create the component in `components/` folder
2. Add TypeScript interfaces in `shared/types.ts`
3. Add utility functions in `shared/utils.ts` if needed
4. Export from `components/index.ts` and main `index.ts`
5. Update this README with usage examples
6. Follow the existing naming conventions and patterns