# Modal Library Implementation Guide

## 📋 Tổng quan

Modal Library của CaterSoft là một hệ thống modal components được thiết kế theo kiến trúc DRY (Don't Repeat Yourself) với mục tiêu:

- **Tái sử dụng cao**: Shared utilities, types và hooks
- **Bảo trì dễ dàng**: Cấu trúc modular và separation of concerns
- **Type Safety**: Full TypeScript support
- **Localization**: Vietnamese text mặc định
- **Performance**: Optimized với React.memo và proper cleanup

## 🏗️ Kiến trúc Tổng thể

### Cấu trúc Thư mục

```
modal/
├── components/          # Generic modal components
│   ├── AlertModal/      # Thông báo và cảnh báo
│   ├── ConfirmModal/    # Xác nhận hành động
│   ├── FormModal/       # Form phức tạp
│   ├── InputModal/      # Thu thập input đơn giản
│   ├── MessageModal/    # Hiển thị message với scroll
│   ├── SelectModal/     # Lựa chọn từ danh sách
│   └── index.ts         # Component exports
├── business/            # Business-specific modals
│   ├── LyDoHuyModal/    # Modal nhập lý do hủy
│   └── index.ts         # Business modal exports
├── shared/              # Shared utilities
│   ├── types.ts         # Type definitions
│   ├── hooks.ts         # Custom hooks
│   ├── utils.ts         # Utility functions
│   ├── store.ts         # Zustand store
│   └── index.ts         # Shared exports
├── docs/                # Documentation
└── index.ts             # Main entry point
```

### Nguyên tắc Thiết kế

1. **Separation of Concerns**
   - Generic components trong `/components`
   - Business logic trong `/business`
   - Shared utilities trong `/shared`

2. **Composition over Inheritance**
   - Business modals compose generic components
   - Shared interfaces cho consistent behavior

3. **TypeScript First**
   - Strict typing cho all interfaces
   - Generic types cho reusability
   - Compile-time validation

## 🔧 Core Components

### 1. Shared Types (`/shared/types.ts`)

#### Base Interfaces

```typescript
// Base props cho tất cả modals
interface IBaseModalProps {
  title: string
  okText?: string
  cancelText?: string
  icon?: React.ReactNode
  onOk?: (...args: any[]) => Promise<void> | void
  onCancel?: () => void
  visible?: boolean
  loading?: boolean
}

// Extended interfaces
interface IContentModalProps extends IBaseModalProps {
  content?: React.ReactNode
}

interface IWidthModalProps extends IBaseModalProps {
  width?: number
}

interface IValidatableModalProps extends IBaseModalProps {
  required?: boolean
  validator?: (value: any) => string | null
}
```

#### Modal Component Interface

```typescript
interface IModalComponent<T> extends React.FC<T> {
  show: (props: Omit<T, 'visible'>) => void
}
```

### 2. Shared Utilities (`/shared/utils.ts`)

#### Error Handling

```typescript
// Consistent error handling across modals
export const handleModalError = (error: any, context: string) => {
  if (error?.errorFields) {
    // Form validation error - don't close modal
    console.warn(`${context} validation failed:`, error)
  } else {
    // Other error
    console.error(`${context} error:`, error)
  }
}

// Async handler wrapper
export const createAsyncHandler = (
  callback?: (...args: any[]) => Promise<void> | void, 
  context: string = 'Modal'
) => {
  return async (...args: any[]) => {
    try {
      if (callback) {
        await callback(...args)
      }
    } catch (error) {
      handleModalError(error, context)
      throw error
    }
  }
}
```

#### Validation System

```typescript
export const validators = {
  required: (value: any, message?: string) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message || 'Trường này là bắt buộc'
    }
    return null
  },
  
  minLength: (value: string, min: number, message?: string) => {
    if (value && value.length < min) {
      return message || `Phải có ít nhất ${min} ký tự`
    }
    return null
  },
  
  email: (value: string, message?: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      return message || 'Email không hợp lệ'
    }
    return null
  }
}
```

### 3. Custom Hooks (`/shared/hooks.ts`)

#### useModalState Hook

```typescript
// Hook cho single value modal state management
const modalState = useModalState({
  defaultValue: '',
  required: true,
  customValidator: (value) => {
    if (value.length < 3) return 'Tối thiểu 3 ký tự'
    return null
  },
  errorContext: 'My Modal'
})

// Usage
modalState.value              // Current value
modalState.setValue(newValue) // Set value
modalState.error              // Current error
modalState.validateValue()    // Validate current value
modalState.handleChange(val)  // Handle change with error clearing
modalState.reset()            // Reset to default
modalState.createValidatedHandler(callback) // Create validated async handler
```

#### useMultiModalState Hook

```typescript
// Hook cho multiple values (forms)
const formState = useMultiModalState({
  name: { required: true, defaultValue: '' },
  email: { required: true, defaultValue: '', customValidator: validators.email },
  age: { defaultValue: 0 }
})

// Usage
formState.getValue('name')           // Get field value
formState.setValue('name', 'John')   // Set field value
formState.getError('name')           // Get field error
formState.validateField('name')      // Validate specific field
formState.validateAll()              // Validate all fields
formState.isValid()                  // Check if all valid
formState.createFormHandler(callback) // Create form submit handler
```

### 4. State Management (`/shared/store.ts`)

```typescript
// Zustand store cho modal visibility management
const modalStore = useModalStore()

// Usage
modalStore.openModal('user-edit')    // Open modal by ID
modalStore.closeModal('user-edit')   // Close modal by ID
modalStore.toggleModal('user-edit')  // Toggle modal
modalStore.closeAll()                // Close all modals
modalStore.modals['user-edit']       // Check if modal is open
```

## 📦 Component Implementation Patterns

### Pattern 1: Generic Modal Component

```typescript
// AlertModal example
interface IAlertModalProps extends IContentModalProps {
  type?: AlertType
}

interface IAlertModalComponent extends IModalComponent<IAlertModalProps> {
  info: (props: Omit<IAlertModalProps, 'visible' | 'type'>) => void
  success: (props: Omit<IAlertModalProps, 'visible' | 'type'>) => void
  warning: (props: Omit<IAlertModalProps, 'visible' | 'type'>) => void
  error: (props: Omit<IAlertModalProps, 'visible' | 'type'>) => void
}

const AlertModal: IAlertModalComponent = (props) => {
  // Component implementation
  if (props.visible) {
    showInfoModal({
      title: props.title,
      icon: props.icon || getAlertIcon(props.type || 'info'),
      content: props.content,
      onOk: props.onOk
    })
  }
  return null
}

// Static methods
AlertModal.show = (props) => { /* implementation */ }
AlertModal.info = (props) => AlertModal.show({ ...props, type: 'info' })
AlertModal.success = (props) => AlertModal.show({ ...props, type: 'success' })
// ...
```

### Pattern 2: Business Modal Component

```typescript
// LyDoHuyModal example - wraps generic component
const LyDoHuyModal = {
  show: (onOk: (lyDo: string) => Promise<void> | void) => {
    InputModal.show({
      title: 'Hủy phiếu',
      placeholder: 'Nhập lý do',
      required: true,
      textArea: true,
      rows: 3,
      onOk
    })
  }
}
```

### Pattern 3: Form Modal với Validation

```typescript
const FormModal: IFormModalComponent = (props) => {
  const [internalForm] = Form.useForm()
  const form = props.form || internalForm

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await props.onOk(values)
    } catch (error) {
      handleModalError(error, 'Form Modal')
    }
  }

  return (
    <Modal
      title={props.title}
      open={props.visible}
      onOk={handleOk}
      onCancel={props.onCancel}
      confirmLoading={props.loading}
    >
      <Form form={form} initialValues={props.initialValues}>
        {props.children}
      </Form>
    </Modal>
  )
}
```

## 🎯 Usage Patterns

### 1. Component Usage (Controlled)

**Khi nào sử dụng:**
- Complex state management
- Integration với Redux/Context
- Conditional modal behavior
- Custom lifecycle management

```typescript
const MyComponent = () => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (value: string) => {
    setLoading(true)
    try {
      await api.saveData(value)
      setVisible(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Modal</Button>
      <InputModal
        visible={visible}
        title="Enter Name"
        required
        loading={loading}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
      />
    </>
  )
}
```

### 2. Static Method Usage (Uncontrolled)

**Khi nào sử dụng:**
- Quick confirmations
- Simple alerts
- One-time input collection
- Event handlers

```typescript
const handleDelete = () => {
  ConfirmModal.show({
    title: 'Xác nhận xóa',
    content: 'Bạn có chắc chắn muốn xóa mục này?',
    onOk: async () => {
      await api.deleteItem(id)
      message.success('Đã xóa thành công')
    }
  })
}

const handleError = (error: string) => {
  AlertModal.error({
    title: 'Lỗi',
    content: error
  })
}
```

### 3. Business Modal Usage

```typescript
const handleCancel = () => {
  LyDoHuyModal.show(async (lyDo: string) => {
    await api.cancelOrder(orderId, lyDo)
    message.success('Đã hủy đơn hàng')
    refreshData()
  })
}
```

## 🔄 Extension Patterns

### 1. Tạo Business Modal Mới

```typescript
// /business/ApprovalModal/ApprovalModal.tsx
import { ConfirmModal } from '../../components/ConfirmModal'

const ApprovalModal = {
  show: (data: ApprovalData, onOk: (approved: boolean) => Promise<void>) => {
    ConfirmModal.show({
      title: 'Phê duyệt yêu cầu',
      content: (
        <div>
          <p>Yêu cầu: {data.title}</p>
          <p>Người gửi: {data.requester}</p>
          <p>Ngày tạo: {data.createdAt}</p>
        </div>
      ),
      okText: 'Phê duyệt',
      cancelText: 'Từ chối',
      onOk: () => onOk(true),
      onCancel: () => onOk(false)
    })
  }
}

export default ApprovalModal
```

### 2. Tạo Generic Modal Mới

```typescript
// /components/DatePickerModal/DatePickerModal.tsx
import { DatePicker } from 'antd'
import { IValidatableModalProps, IModalComponent } from '../../shared/types'

interface IDatePickerModalProps extends IValidatableModalProps {
  defaultValue?: string
  format?: string
  onOk: (date: string) => Promise<void> | void
}

const DatePickerModal: IModalComponent<IDatePickerModalProps> = (props) => {
  const modalState = useModalState({
    defaultValue: props.defaultValue,
    required: props.required,
    customValidator: props.validator
  })

  // Implementation...
}

DatePickerModal.show = (props) => {
  // Static method implementation...
}

export default DatePickerModal
```

### 3. Extend Shared Utilities

```typescript
// /shared/utils.ts - thêm validator mới
export const validators = {
  // ... existing validators
  
  phoneNumber: (value: string, message?: string) => {
    const phoneRegex = /^[0-9]{10,11}$/
    if (value && !phoneRegex.test(value)) {
      return message || 'Số điện thoại không hợp lệ'
    }
    return null
  },
  
  dateRange: (startDate: string, endDate: string, message?: string) => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return message || 'Ngày bắt đầu phải trước ngày kết thúc'
    }
    return null
  }
}
```

## 🎨 Styling và Theming

### Ant Design Integration

```typescript
// Sử dụng Ant Design theme tokens
const getAlertIcon = (type: AlertType): React.ReactNode => {
  const iconProps = {
    style: { 
      fontSize: '22px',
      marginRight: '8px'
    }
  }
  
  switch (type) {
    case 'success':
      return <CheckCircleOutlined {...iconProps} style={{...iconProps.style, color: token.colorSuccess}} />
    case 'error':
      return <CloseCircleOutlined {...iconProps} style={{...iconProps.style, color: token.colorError}} />
    // ...
  }
}
```

### Custom Styling

```typescript
// Modal với custom styling
const StyledModal = styled(Modal)`
  .ant-modal-header {
    background: ${props => props.theme.primaryColor};
    color: white;
  }
  
  .ant-modal-body {
    padding: 24px;
  }
`
```

## 🧪 Testing Strategies

### Unit Testing

```typescript
// AlertModal.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react'
import { AlertModal } from '../AlertModal'

describe('AlertModal', () => {
  it('should show success alert', async () => {
    const onOk = jest.fn()
    
    AlertModal.success({
      title: 'Success',
      content: 'Operation completed',
      onOk
    })
    
    const okButton = screen.getByText('OK')
    fireEvent.click(okButton)
    
    await waitFor(() => {
      expect(onOk).toHaveBeenCalled()
    })
  })
})
```

### Integration Testing

```typescript
// Modal integration test
it('should handle form submission with validation', async () => {
  const onSubmit = jest.fn()
  
  render(
    <FormModal
      visible={true}
      title="Test Form"
      onOk={onSubmit}
    >
      <Form.Item name="name" rules={[{ required: true }]}>
        <Input placeholder="Name" />
      </Form.Item>
    </FormModal>
  )
  
  // Test validation
  fireEvent.click(screen.getByText('Xác nhận'))
  expect(screen.getByText('Please input name')).toBeInTheDocument()
  
  // Test successful submission
  fireEvent.change(screen.getByPlaceholderText('Name'), {
    target: { value: 'John Doe' }
  })
  fireEvent.click(screen.getByText('Xác nhận'))
  
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John Doe' })
  })
})
```

## 🚀 Performance Optimization

### 1. React.memo Usage

```typescript
// Optimize re-renders
const AlertModal = React.memo<IAlertModalProps>((props) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.visible === nextProps.visible &&
         prevProps.title === nextProps.title &&
         prevProps.content === nextProps.content
})
```

### 2. Lazy Loading

```typescript
// Lazy load heavy modals
const FormModal = React.lazy(() => import('./FormModal'))

const MyComponent = () => {
  return (
    <Suspense fallback={<Spin />}>
      <FormModal {...props} />
    </Suspense>
  )
}
```

### 3. Cleanup Strategies

```typescript
// Proper cleanup in useEffect
useEffect(() => {
  if (visible) {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
    
    return () => clearTimeout(timer)
  }
}, [visible])
```

## 📚 Best Practices

### 1. Code Organization

- **Single Responsibility**: Mỗi modal component có một mục đích rõ ràng
- **Composition**: Business modals compose generic components
- **Shared Logic**: Tận dụng shared utilities và hooks
- **Type Safety**: Sử dụng TypeScript strict mode

### 2. Error Handling

- **Consistent Logging**: Sử dụng `handleModalError` cho all error cases
- **User Feedback**: Hiển thị error messages rõ ràng
- **Graceful Degradation**: Modal không crash khi có lỗi

### 3. Accessibility

- **Keyboard Navigation**: Support Tab, Enter, Escape keys
- **Screen Reader**: Proper ARIA labels và roles
- **Focus Management**: Auto-focus input fields
- **Color Contrast**: Đảm bảo contrast ratio đạt chuẩn

### 4. Internationalization

```typescript
// i18n support
const defaultTexts = {
  vi: {
    ok: 'OK',
    confirm: 'Xác nhận',
    cancel: 'Hủy',
    required: 'Trường này là bắt buộc'
  },
  en: {
    ok: 'OK',
    confirm: 'Confirm',
    cancel: 'Cancel',
    required: 'This field is required'
  }
}
```

### 5. Security

- **Input Sanitization**: Sanitize user input trước khi display
- **XSS Prevention**: Sử dụng React's built-in XSS protection
- **Data Validation**: Validate data ở cả client và server side

## 🔮 Future Enhancements

### 1. Advanced Features

- **Modal Stacking**: Support multiple modals simultaneously
- **Drag & Drop**: Draggable modal headers
- **Resize**: Resizable modal windows
- **Animation**: Custom enter/exit animations

### 2. Developer Experience

- **Storybook Integration**: Interactive component documentation
- **Code Generation**: CLI tools để generate modal boilerplate
- **DevTools**: Browser extension cho modal debugging

### 3. Performance

- **Virtual Scrolling**: Cho large lists trong SelectModal
- **Bundle Splitting**: Dynamic imports cho modal components
- **Caching**: Cache modal configurations

## 📖 Migration Guide

### From Legacy Modals

```typescript
// Before (legacy)
Modal.confirm({
  title: 'Xác nhận',
  content: 'Bạn có chắc chắn?',
  onOk: handleOk
})

// After (new library)
ConfirmModal.show({
  title: 'Xác nhận',
  content: 'Bạn có chắc chắn?',
  onOk: handleOk
})
```

### Breaking Changes

- `visible` prop thay vì `open` (Ant Design v5)
- Async error handling được built-in
- Vietnamese text mặc định

## 🤝 Contributing

### Adding New Components

1. Tạo component directory trong `/components` hoặc `/business`
2. Implement component theo established patterns
3. Add TypeScript interfaces
4. Write unit tests
5. Update exports trong `index.ts`
6. Update documentation

### Code Review Checklist

- [ ] TypeScript types đầy đủ
- [ ] Error handling proper
- [ ] Tests coverage > 80%
- [ ] Documentation updated
- [ ] Accessibility compliant
- [ ] Performance optimized

---

*Tài liệu này được cập nhật thường xuyên. Vui lòng check version mới nhất trước khi implement.*