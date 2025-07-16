# Button Section Components

Thư viện các Button components được xây dựng dựa trên Ant Design, được tổ chức theo chức năng để dễ dàng sử dụng, mở rộng và debug.

## Cấu trúc thư mục

```
button-section/
├── index.ts                 # Export tất cả components
├── primary/                 # Primary buttons
├── secondary/               # Secondary buttons
├── danger/                  # Danger buttons
├── ghost/                   # Ghost buttons
├── link/                    # Link buttons
├── icon/                    # Icon buttons
├── loading/                 # Loading buttons
├── action/                  # Action buttons
├── submit/                  # Submit buttons
├── cancel/                  # Cancel buttons
└── group/                   # Group buttons
    ├── GroupButton.tsx
    ├── FormActionGroup.tsx
    ├── TableActionGroup.tsx
    └── ToolbarGroup.tsx
```

## Các Components

### 1. PrimaryButton
Sử dụng cho các hành động chính, quan trọng nhất trong giao diện.

```tsx
import { PrimaryButton } from '@/general-components/button-section';

<PrimaryButton testId="save-btn" onClick={handleSave}>
  Lưu
</PrimaryButton>
```

### 2. SecondaryButton
Sử dụng cho các hành động phụ, không quan trọng bằng primary button.

```tsx
import { SecondaryButton } from '@/general-components/button-section';

<SecondaryButton testId="edit-btn" onClick={handleEdit}>
  Chỉnh sửa
</SecondaryButton>
```

### 3. DangerButton
Sử dụng cho các hành động nguy hiểm như xóa, hủy bỏ không thể hoàn tác.

```tsx
import { DangerButton } from '@/general-components/button-section';

<DangerButton testId="delete-btn" variant="primary" onClick={handleDelete}>
  Xóa
</DangerButton>
```

### 4. GhostButton
Sử dụng cho giao diện trong suốt, thường dùng trên background có màu.

```tsx
import { GhostButton } from '@/general-components/button-section';

<GhostButton testId="ghost-btn" buttonType="primary" onClick={handleAction}>
  Hành động
</GhostButton>
```

### 5. LinkButton
Sử dụng cho các liên kết hoặc hành động không quan trọng.

```tsx
import { LinkButton } from '@/general-components/button-section';

<LinkButton testId="link-btn" href="/page" target="_blank">
  Xem chi tiết
</LinkButton>
```

### 6. IconButton
Sử dụng cho các button chỉ có icon, thường dùng cho các hành động nhanh.

```tsx
import { IconButton } from '@/general-components/button-section';
import { EditOutlined } from '@ant-design/icons';

<IconButton 
  testId="edit-icon-btn" 
  icon={<EditOutlined />} 
  shape="circle" 
  tooltip="Chỉnh sửa"
  onClick={handleEdit}
/>
```

### 7. LoadingButton
Sử dụng cho các button cần hiển thị trạng thái loading khi xử lý.

```tsx
import { LoadingButton } from '@/general-components/button-section';

<LoadingButton 
  testId="loading-btn" 
  loading={isLoading} 
  loadingText="Đang xử lý..."
  onClick={handleSubmit}
>
  Gửi
</LoadingButton>
```

### 8. ActionButton
Sử dụng cho các hành động cụ thể với styling phù hợp.

```tsx
import { ActionButton } from '@/general-components/button-section';
import { PlusOutlined } from '@ant-design/icons';

<ActionButton 
  testId="add-btn" 
  actionType="add" 
  variant="primary"
  icon={<PlusOutlined />}
  onClick={handleAdd}
>
  Thêm mới
</ActionButton>
```

### 9. SubmitButton
Sử dụng cho việc submit form với trạng thái loading tự động.

```tsx
import { SubmitButton } from '@/general-components/button-section';

<SubmitButton 
  testId="submit-btn" 
  submitting={isSubmitting}
  submittingText="Đang lưu..."
  formName="user-form"
>
  Lưu thông tin
</SubmitButton>
```

### 10. CancelButton
Sử dụng cho việc hủy bỏ các hành động, form, modal.

```tsx
import { CancelButton } from '@/general-components/button-section';

<CancelButton 
  testId="cancel-btn" 
  variant="default"
  confirmCancel={true}
  confirmMessage="Bạn có chắc chắn muốn hủy bỏ?"
  onClick={handleCancel}
>
  Hủy bỏ
</CancelButton>
```

### 11. GroupButton
Sử dụng để nhóm các button liên quan lại với nhau.

```tsx
import { GroupButton } from '@/general-components/button-section';

<GroupButton 
  testId="group-btn" 
  size="middle"
  direction="horizontal"
  spacing={8}
>
  <PrimaryButton>Lưu</PrimaryButton>
  <SecondaryButton>Hủy</SecondaryButton>
</GroupButton>
```

### 12. FormActionGroup
Sử dụng cho nhóm các button hành động trong form.

```tsx
import { FormActionGroup } from '@/general-components/button-section';

<FormActionGroup 
  testId="form-actions" 
  submitText="Lưu thông tin"
  cancelText="Hủy bỏ"
  submitting={isSubmitting}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  showReset={true}
  resetText="Đặt lại"
  onReset={handleReset}
/>
```

### 13. TableActionGroup
Sử dụng cho nhóm các button hành động trong bảng.

```tsx
import { TableActionGroup } from '@/general-components/button-section';

<TableActionGroup 
  testId="table-actions" 
  record={record}
  actions={[
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      onClick: handleEdit
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      danger: true,
      confirm: true,
      confirmMessage: 'Bạn có chắc chắn muốn xóa?',
      onClick: handleDelete
    }
  ]}
/>
```

### 14. ToolbarGroup
Sử dụng cho nhóm các button trong toolbar.

```tsx
import { ToolbarGroup } from '@/general-components/button-section';

<ToolbarGroup 
  testId="toolbar" 
  actions={[
    {
      key: 'add',
      label: 'Thêm mới',
      icon: <PlusOutlined />,
      type: 'primary',
      onClick: handleAdd
    },
    {
      key: 'export',
      label: 'Xuất Excel',
      icon: <ExportOutlined />,
      onClick: handleExport
    },
    {
      key: 'refresh',
      label: 'Làm mới',
      icon: <ReloadOutlined />,
      onClick: handleRefresh
    }
  ]}
/>
```

## Tính năng chung

### Data TestId
Tất cả các button đều có `data-testid` để hỗ trợ testing:
- Có thể tự động generate dựa trên loại button
- Có thể custom thông qua prop `testId`
- Hỗ trợ thêm `formName` để tạo testId cụ thể hơn

### Styling
Mỗi button có className riêng để dễ dàng custom CSS:
- `primary-button`
- `secondary-button`
- `danger-button`
- `ghost-button`
- `link-button`
- `icon-button`
- `loading-button`
- `action-button action-button-{actionType}`
- `submit-button`
- `cancel-button`
- `group-button`
- `form-action-group`
- `table-action-group`
- `toolbar-group`

### TypeScript Support
Tất cả components đều có TypeScript types đầy đủ và được export để sử dụng.

## Best Practices

1. **Sử dụng đúng loại button cho đúng mục đích**
2. **Luôn cung cấp testId cho testing**
3. **Sử dụng ActionButton với actionType phù hợp**
4. **Sử dụng SubmitButton cho form submission**
5. **Sử dụng CancelButton với confirmation khi cần thiết**
6. **Sử dụng LoadingButton khi có async operations**