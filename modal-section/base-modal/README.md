# Base Modal Component

## 📋 Tổng quan

Base Modal là một component modal có thể tái sử dụng được tạo ra từ việc tách các tính năng cơ bản từ TuyChonTable modal. Component này tuân theo nguyên tắc DRY (Don't Repeat Yourself) và SRP (Single Responsibility Principle).

## 🎯 Tính năng chính

### 1. **Drag & Drop**
- Kéo thả modal bằng cách click vào tiêu đề
- Lưu vị trí modal vào localStorage theo modalId
- Tự động căn giữa màn hình nếu chưa có vị trí đã lưu
- Giới hạn vị trí modal trong viewport

### 2. **State Management với Zustand**
- Store riêng biệt cho từng modal (theo modalId)
- Persist vị trí modal và trạng thái hướng dẫn
- Tự động khôi phục trạng thái khi reload

### 3. **Accessibility**
- Đầy đủ ARIA labels
- Hỗ trợ keyboard navigation
- Screen reader friendly
- Focus management

### 4. **Loading State**
- Loading overlay với spinner
- Tùy chỉnh nội dung loading
- Opacity transition khi loading

### 5. **Guidance System**
- Toggle hiển thị/ẩn hướng dẫn
- Lưu trạng thái hướng dẫn
- Tùy chỉnh text hướng dẫn

### 6. **Unsaved Changes Indicator**
- Hiển thị thông báo có thay đổi chưa lưu
- Animation pulse để thu hút chú ý
- Tùy chỉnh text thông báo

## 📁 Cấu trúc file

```
base-modal/
├── BaseModal.tsx           # Component chính
├── BaseModal.less          # Styles
├── types.ts               # TypeScript interfaces
├── constants.ts           # Constants và styles
├── useBaseModalStore.ts   # Zustand store
├── useDraggableBaseModal.ts # Drag & drop hook
├── index.ts              # Exports
└── README.md             # Documentation
```

## 🚀 Cách sử dụng

### Basic Usage

```tsx
import { BaseModal } from '../base-modal';
import { SettingOutlined } from '@ant-design/icons';

const MyModal = () => {
  const [visible, setVisible] = useState(false);

  return (
    <BaseModal
      visible={visible}
      onCancel={() => setVisible(false)}
      title="My Modal"
      titleIcon={<SettingOutlined />}
      modalId="my-modal"
      guidanceText="Kéo tiêu đề để di chuyển modal"
    >
      <div>Modal content here</div>
    </BaseModal>
  );
};
```

### Advanced Usage với Loading

```tsx
import { BaseModal } from '../base-modal';

const AdvancedModal = () => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <BaseModal
      visible={visible}
      onCancel={() => setVisible(false)}
      title="Advanced Modal"
      modalId="advanced-modal"
      isLoading={isLoading}
      hasUnsavedChanges={hasChanges}
      loadingContent={<div>Custom loading...</div>}
      onKeyDown={(e) => {
        if (e.key === 'F5') {
          e.preventDefault();
          // Custom key handler
        }
      }}
    >
      <div>Advanced content</div>
    </BaseModal>
  );
};
```

### Tùy chỉnh Footer

```tsx
import { BaseModal } from '../base-modal';
import { Button, Space } from 'antd';

const CustomFooterModal = () => {
  return (
    <BaseModal
      visible={true}
      onCancel={() => {}}
      title="Custom Footer"
      modalId="custom-footer-modal"
      footer={
        <Space>
          <Button onClick={() => {}}>Cancel</Button>
          <Button type="primary" onClick={() => {}}>Save</Button>
        </Space>
      }
    >
      <div>Content with custom footer</div>
    </BaseModal>
  );
};
```

## 🎨 Customization

### Tùy chỉnh Styles

```tsx
import { BaseModal, BASE_MODAL_STYLES } from '../base-modal';

const StyledModal = () => {
  return (
    <BaseModal
      visible={true}
      onCancel={() => {}}
      title="Styled Modal"
      modalId="styled-modal"
      className="my-custom-modal"
      style={{
        ...BASE_MODAL_STYLES.modalStyle({ x: 100, y: 100 }),
        border: '2px solid #1890ff',
      }}
      width={800}
      zIndex={20000}
    >
      <div>Styled content</div>
    </BaseModal>
  );
};
```

### Tùy chỉnh Store

```tsx
import { useBaseModalStore } from '../base-modal';

const ModalController = () => {
  const { 
    showGuidance, 
    toggleGuidance, 
    setModalPosition,
    getModalPosition 
  } = useBaseModalStore();

  const resetModalPosition = () => {
    setModalPosition('my-modal', { x: 0, y: 0 });
  };

  return (
    <div>
      <button onClick={toggleGuidance}>
        {showGuidance ? 'Hide' : 'Show'} Guidance
      </button>
      <button onClick={resetModalPosition}>
        Reset Position
      </button>
    </div>
  );
};
```

## 🔧 Props API

### BaseModalProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | - | Hiển thị modal |
| `onCancel` | `() => void` | - | Callback khi đóng modal |
| `title` | `string` | `'Modal'` | Tiêu đề modal |
| `titleIcon` | `React.ReactNode` | - | Icon cho tiêu đề |
| `children` | `React.ReactNode` | - | Nội dung modal |
| `footer` | `React.ReactNode` | - | Footer tùy chỉnh |
| `width` | `number` | `600` | Chiều rộng modal |
| `modalId` | `string` | `'default-modal'` | ID duy nhất cho modal |
| `draggable` | `boolean` | `true` | Có thể kéo thả không |
| `mask` | `boolean` | `false` | Hiển thị mask |
| `zIndex` | `number` | `10002` | Z-index |
| `destroyOnClose` | `boolean` | `true` | Destroy khi đóng |
| `ariaLabel` | `string` | - | ARIA label |
| `showGuidance` | `boolean` | - | Hiển thị hướng dẫn |
| `onToggleGuidance` | `() => void` | - | Callback toggle hướng dẫn |
| `guidanceText` | `string` | - | Text hướng dẫn |
| `showGuidanceToggle` | `boolean` | `true` | Hiển thị nút toggle |
| `hasUnsavedChanges` | `boolean` | `false` | Có thay đổi chưa lưu |
| `unsavedChangesText` | `string` | `'(có thay đổi)'` | Text thông báo |
| `isLoading` | `boolean` | `false` | Trạng thái loading |
| `loadingContent` | `React.ReactNode` | - | Nội dung loading |
| `onKeyDown` | `(e: KeyboardEvent) => void` | - | Handler phím tắt |
| `className` | `string` | `''` | Class name tùy chỉnh |
| `style` | `React.CSSProperties` | - | Style tùy chỉnh |

## 🎯 Design Principles

### 1. **Single Responsibility Principle (SRP)**
- Mỗi file có một trách nhiệm cụ thể
- Component chỉ lo việc render và UI logic
- Store chỉ lo việc quản lý state
- Hook chỉ lo việc drag & drop logic

### 2. **Don't Repeat Yourself (DRY)**
- Tách các logic chung thành base modal
- Có thể tái sử dụng cho nhiều modal khác
- Constants và styles được centralize

### 3. **Composition over Inheritance**
- Sử dụng props để customize behavior
- Children pattern cho nội dung
- Render props cho footer

### 4. **Accessibility First**
- ARIA labels đầy đủ
- Keyboard navigation
- Screen reader support
- Focus management

## 🔄 Migration từ TuyChonTable Modal

Để migrate từ TuyChonTable modal sang BaseModal:

```tsx
// Before (TuyChonTable modal)
<TuyChonModal
  visible={visible}
  onCancel={onCancel}
  tableTitle="My Table"
  // ... other props
>
  {/* specific content */}
</TuyChonModal>

// After (BaseModal)
<BaseModal
  visible={visible}
  onCancel={onCancel}
  title={`Tùy chọn cho ${tableTitle}`}
  titleIcon={<SettingOutlined />}
  modalId={`table-${tableId}`}
  guidanceText="Kéo tiêu đề để di chuyển modal • Dữ liệu tự động lưu riêng cho bảng"
>
  {/* specific content */}
</BaseModal>
```

## 🧪 Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BaseModal } from '../base-modal';

describe('BaseModal', () => {
  it('should render modal with title', () => {
    render(
      <BaseModal visible={true} onCancel={() => {}} title="Test Modal">
        <div>Test content</div>
      </BaseModal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should handle drag and drop', () => {
    render(
      <BaseModal visible={true} onCancel={() => {}} title="Draggable Modal" modalId="test-modal">
        <div>Content</div>
      </BaseModal>
    );
    
    const title = screen.getByText('Draggable Modal');
    fireEvent.mouseDown(title);
    // Test drag logic
  });
});
```

## 📈 Performance

- Sử dụng `useCallback` để tránh re-render không cần thiết
- CSS transitions thay vì JavaScript animations
- Lazy loading cho các component phức tạp
- Memoization cho các calculations nặng

## 🔮 Future Enhancements

1. **Theme Support**: Dark/light mode
2. **Animation Library**: Framer Motion integration
3. **Responsive Breakpoints**: Better mobile support
4. **Keyboard Shortcuts**: Extensible shortcut system
5. **Confirmation Dialogs**: Built-in unsaved changes confirmation