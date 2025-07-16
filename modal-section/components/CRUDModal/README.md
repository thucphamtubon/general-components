# CRUD Modal System

A comprehensive CRUD modal system built following Single Responsibility Principle (SRP) for the CaterSoft application. This system provides reusable modal components for Create, Read, Update, and Delete operations.

## 🏗️ Architecture Overview

The CRUD modal system is designed with SRP in mind, where each component has a single, well-defined responsibility:

```
CRUDModal/
├── types.ts                 # Type definitions and interfaces
├── CRUDModalErrorAlert.tsx  # Error display component
├── CRUDModalFooter.tsx      # Footer with action buttons
├── useCRUDModal.ts         # State management hook
├── CRUDModalBase.tsx       # Core modal structure
├── CRUDModal.tsx           # Main orchestrator component
├── index.ts                # Exports
└── README.md               # Documentation
```

### Component Responsibilities

- **CRUDModalErrorAlert**: Single responsibility for error display
- **CRUDModalFooter**: Single responsibility for footer and action buttons
- **useCRUDModal**: Single responsibility for state management and handlers
- **CRUDModalBase**: Single responsibility for modal structure and rendering
- **CRUDModal**: Single responsibility for component orchestration and integration

## 🚀 Basic Usage

### 1. Simple Create Modal

```tsx
import { CRUDModal } from 'general-components/modal'
import { Form, Input } from 'antd'

const CreateUserModal = () => {
  const [form] = Form.useForm()

  return (
    <CRUDModal
      modalId="create-user-modal"
      mode="create"
      entityName="người dùng"
      form={form}
      onCreateSubmit={async (data) => {
        await userService.create(data)
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
      </Form>
    </CRUDModal>
  )
}
```

### 2. Edit Modal with Initial Data

```tsx
const EditUserModal = ({ userData }) => {
  const [form] = Form.useForm()

  return (
    <CRUDModal
      modalId="edit-user-modal"
      mode="edit"
      entityName="người dùng"
      form={form}
      initialData={userData}
      onEditSubmit={async (data) => {
        await userService.update(userData.id, data)
      }}
    >
      <Form form={form} layout="vertical" initialValues={userData}>
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
      </Form>
    </CRUDModal>
  )
}
```

### 3. View Modal (Read-only)

```tsx
const ViewUserModal = ({ userData }) => {
  return (
    <CRUDModal
      modalId="view-user-modal"
      mode="view"
      entityName="người dùng"
      initialData={userData}
      showDeleteButton={true}
      onDeleteSubmit={async (data) => {
        await userService.delete(data.id)
      }}
    >
      <div>
        <p><strong>Tên:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Ngày tạo:</strong> {userData.createdAt}</p>
      </div>
    </CRUDModal>
  )
}
```

## 🔧 Advanced Usage

### 1. Custom Validation and Data Transformation

```tsx
const AdvancedCRUDModal = () => {
  const [form] = Form.useForm()

  return (
    <CRUDModal
      modalId="advanced-crud-modal"
      mode="create"
      entityName="sản phẩm"
      form={form}
      validateBeforeSubmit={async (data) => {
        // Custom validation logic
        if (data.price <= 0) {
          return false
        }
        return true
      }}
      transformDataBeforeSubmit={(data) => ({
        ...data,
        price: parseFloat(data.price),
        createdAt: new Date().toISOString()
      })}
      onCreateSubmit={async (data) => {
        await productService.create(data)
      }}
      onValidationError={(errors) => {
        console.error('Validation errors:', errors)
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
      </Form>
    </CRUDModal>
  )
}
```

### 2. Permission-based CRUD Operations

```tsx
const PermissionBasedModal = ({ userPermissions }) => {
  const [form] = Form.useForm()

  return (
    <CRUDModal
      modalId="permission-modal"
      mode="edit"
      entityName="tài khoản"
      form={form}
      permissions={{
        canEdit: userPermissions.canEditUser,
        canDelete: userPermissions.canDeleteUser,
        canView: userPermissions.canViewUser
      }}
      canAccess={userPermissions.canAccessUserModal}
      accessDeniedMessage="Bạn không có quyền truy cập chức năng quản lý người dùng"
      showDeleteButton={true}
      onEditSubmit={async (data) => {
        await userService.update(data.id, data)
      }}
      onDeleteSubmit={async (data) => {
        await userService.delete(data.id)
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên">
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Vai trò">
          <Select>
            <Select.Option value="admin">Quản trị viên</Select.Option>
            <Select.Option value="user">Người dùng</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </CRUDModal>
  )
}
```

### 3. Using with Custom Hook

```tsx
const CustomHookExample = () => {
  const crudModal = useCRUDModal({
    modalId: 'custom-hook-modal',
    mode: 'create',
    entityName: 'khách hàng',
    onSuccess: async (data) => {
      await customerService.create(data)
    },
    onError: (error) => {
      console.error('CRUD operation failed:', error)
    }
  })

  return (
    <div>
      <button onClick={crudModal.openModal}>
        Tạo khách hàng mới
      </button>
      
      <CRUDModalBase
        modalId="custom-hook-modal"
        mode="create"
        title="Tạo khách hàng"
        loading={crudModal.modalState.loading}
        submitLoading={crudModal.modalState.submitLoading}
        errors={crudModal.modalState.errors}
        onSubmit={crudModal.handleSubmit}
        onCancel={crudModal.handleCancel}
        onErrorClose={crudModal.handleErrorClose}
      >
        {/* Your form content */}
      </CRUDModalBase>
    </div>
  )
}
```

## 📋 Component Props

### CRUDModal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modalId` | `string` | - | Unique identifier for the modal |
| `mode` | `'create' \| 'edit' \| 'view' \| 'delete'` | - | CRUD operation mode |
| `entityName` | `string` | `'dữ liệu'` | Name of the entity being operated on |
| `children` | `ReactNode \| (state) => ReactNode` | - | Modal content |
| `onCreateSubmit` | `(data) => Promise<void>` | - | Create operation callback |
| `onEditSubmit` | `(data) => Promise<void>` | - | Edit operation callback |
| `onDeleteSubmit` | `(data) => Promise<void>` | - | Delete operation callback |
| `form` | `FormInstance` | - | Ant Design form instance |
| `initialData` | `any` | - | Initial data for the form |
| `permissions` | `ICRUDModalPermissions` | `{}` | Permission configuration |
| `canAccess` | `boolean` | `true` | Whether user can access the modal |
| `validateBeforeSubmit` | `(data) => boolean \| Promise<boolean>` | - | Custom validation function |
| `transformDataBeforeSubmit` | `(data) => any` | - | Data transformation function |

### Permission Configuration

```tsx
interface ICRUDModalPermissions {
  canCreate?: boolean
  canEdit?: boolean
  canView?: boolean
  canDelete?: boolean
  canSubmit?: boolean
  canCancel?: boolean
}
```

## 🎯 CRUD Modes

### Create Mode
- Shows "Tạo mới" button
- Calls `onCreateSubmit` when submitted
- Default title: "Tạo {entityName}"
- Icon: Plus icon

### Edit Mode
- Shows "Cập nhật" button
- Calls `onEditSubmit` when submitted
- Default title: "Chỉnh sửa {entityName}"
- Icon: Edit icon

### View Mode
- Shows "Chỉnh sửa" button (switches to edit mode)
- Read-only content display
- Optional delete button
- Default title: "Xem {entityName}"
- Icon: Eye icon

### Delete Mode
- Shows "Xóa" button with danger styling
- Calls `onDeleteSubmit` when submitted
- Shows confirmation dialog
- Default title: "Xóa {entityName}"
- Icon: Delete icon

## 🔨 State Management

The CRUD modal system uses the existing modal store from the general-components library:

```tsx
import { useModalStore } from 'general-components/modal'

// Open modal
const openModal = useModalStore(state => state.openModal)
openModal('my-modal-id')

// Close modal
const closeModal = useModalStore(state => state.closeModal)
closeModal('my-modal-id')
```

## 🚦 Error Handling

The system provides comprehensive error handling:

```tsx
<CRUDModal
  modalId="error-handling-modal"
  mode="create"
  entityName="đơn hàng"
  onCreateSubmit={async (data) => {
    try {
      await orderService.create(data)
    } catch (error) {
      throw new Error('Không thể tạo đơn hàng: ' + error.message)
    }
  }}
  onSubmitError={(error) => {
    // Custom error handling
    console.error('Submit failed:', error)
  }}
  onValidationError={(errors) => {
    // Custom validation error handling
    console.error('Validation failed:', errors)
  }}
>
  {/* Form content */}
</CRUDModal>
```

## 🎨 Styling and Customization

### Custom Footer Actions

```tsx
<CRUDModal
  modalId="custom-footer-modal"
  mode="edit"
  entityName="báo cáo"
  customFooterActions={
    <Button type="default" icon={<PrinterOutlined />}>
      In báo cáo
    </Button>
  }
  showDeleteButton={true}
>
  {/* Content */}
</CRUDModal>
```

### Custom Styling

```tsx
<CRUDModal
  modalId="styled-modal"
  mode="create"
  entityName="thông báo"
  width={800}
  footerClassName="custom-footer"
  contentClassName="custom-content"
  maskClosable={false}
  destroyOnClose={true}
>
  {/* Content */}
</CRUDModal>
```

## 📱 Integration with Existing Code

To integrate with existing PurchaseRequest-like modals:

```tsx
// Old way (PurchaseRequestModalBase)
<PurchaseRequestModalBase
  modalId="purchase-request-modal"
  title="Tạo phiếu đề xuất"
  loading={loading}
  submitLoading={submitLoading}
  onSubmit={handleSubmit}
  // ... many props
>
  {/* Content */}
</PurchaseRequestModalBase>

// New way (CRUDModal)
<CRUDModal
  modalId="purchase-request-modal"
  mode="create"
  entityName="phiếu đề xuất"
  form={form}
  onCreateSubmit={handleSubmit}
  permissions={{ canCreate: true }}
>
  {/* Same content */}
</CRUDModal>
```

## 🏆 Best Practices

1. **Use descriptive modalId**: Always use unique, descriptive IDs for modals
2. **Specify entityName**: Provide clear entity names for better user experience
3. **Handle permissions**: Always configure permissions appropriately
4. **Validate data**: Use `validateBeforeSubmit` for complex validation logic
5. **Transform data**: Use `transformDataBeforeSubmit` for data processing
6. **Handle errors**: Implement proper error handling with callbacks
7. **Use modes correctly**: Choose the right mode for each operation
8. **Test accessibility**: Ensure proper ARIA labels and keyboard navigation

## 🧪 Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { CRUDModal } from 'general-components/modal'

describe('CRUDModal', () => {
  it('should render create modal correctly', () => {
    render(
      <CRUDModal
        modalId="test-modal"
        mode="create"
        entityName="test-entity"
      >
        <div>Test content</div>
      </CRUDModal>
    )
    
    expect(screen.getByTestId('crud-modal-test-modal')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
})
```

The CRUD modal system provides a robust, scalable solution for all CRUD operations in the CaterSoft application while maintaining clean architecture and following SRP principles. 