import { ExclamationCircleOutlined } from '@ant-design/icons'
import React from 'react'
import { IContentModalProps, IModalComponent } from './types'
import { showConfirmModal, defaultTexts } from './utils'

/**
 * Props interface for ConfirmModal component
 */
export interface IConfirmModalProps extends IContentModalProps {
  /** Function to execute when user clicks confirm */
  onOk: () => Promise<void> | void
}

/**
 * ConfirmModal component interface with static show method
 */
interface IConfirmModalComponent extends IModalComponent<IConfirmModalProps> {}

/**
 * ConfirmModal Component
 * 
 * A reusable confirmation modal component with two usage patterns:
 * 
 * 1. Component Usage (controlled):
 *    ```tsx
 *    const [visible, setVisible] = useState(false)
 *    
 *    <ConfirmModal
 *      visible={visible}
 *      title="Xác nhận xóa"
 *      content="Bạn có chắc chắn muốn xóa mục này?"
 *      onOk={async () => {
 *        await deleteItem()
 *        setVisible(false)
 *      }}
 *      onCancel={() => setVisible(false)}
 *    />
 *    ```
 * 
 * 2. Static Method Usage (uncontrolled):
 *    ```tsx
 *    ConfirmModal.show({
 *      title: "Xác nhận xóa",
 *      content: "Bạn có chắc chắn muốn xóa mục này?",
 *      onOk: async () => {
 *        await deleteItem()
 *      }
 *    })
 *    ```
 * 
 * Features:
 * - Vietnamese localization by default
 * - Async onOk support with error handling
 * - Loading state support
 * - Customizable icon, text, and content
 * - Automatic error logging
 */
const ConfirmModal: IConfirmModalComponent = ({
  title,
  content,
  okText = defaultTexts.confirm,
  cancelText = defaultTexts.cancel,
  icon = React.createElement(ExclamationCircleOutlined),
  onOk,
  onCancel,
  visible = false,
  loading = false
}) => {
  // Show modal when visible prop is true
  if (visible) {
    showConfirmModal({
      title,
      icon,
      content,
      okText,
      cancelText,
      onOk,
      onCancel,
      loading
    })
  }

  return null
}

/**
 * Static method to show confirmation modal directly
 * 
 * This method creates a modal without needing to manage visibility state.
 * Useful for quick confirmations that don't require complex state management.
 * 
 * @param props - Modal configuration (excluding 'visible' prop)
 * 
 * @example
 * ```tsx
 * // Simple confirmation
 * ConfirmModal.show({
 *   title: "Xác nhận",
 *   content: "Bạn có chắc chắn?",
 *   onOk: () => console.log('Confirmed')
 * })
 * 
 * // With custom text and loading state
 * ConfirmModal.show({
 *   title: "Xóa dữ liệu",
 *   content: "Dữ liệu sẽ bị xóa vĩnh viễn",
 *   okText: "Xóa",
 *   cancelText: "Không",
 *   loading: true,
 *   onOk: async () => {
 *     await deleteData()
 *   }
 * })
 * ```
 */
ConfirmModal.show = (props: Omit<IConfirmModalProps, 'visible'>) => {
  showConfirmModal({
    title: props.title,
    icon: props.icon || React.createElement(ExclamationCircleOutlined),
    content: props.content,
    okText: props.okText || defaultTexts.confirm,
    cancelText: props.cancelText || defaultTexts.cancel,
    onOk: props.onOk,
    onCancel: props.onCancel,
    loading: props.loading
  })
}

export default ConfirmModal 