import { AlertType, IContentModalProps, IModalComponent } from './types'
import { getAlertIcon, showInfoModal, defaultTexts } from './utils'

/**
 * Props interface for AlertModal component
 */
export interface IAlertModalProps extends IContentModalProps {
  /** Type of alert (affects icon and styling) */
  type?: AlertType
}

/**
 * AlertModal component interface with static show method
 */
interface IAlertModalComponent extends IModalComponent<IAlertModalProps> {
  /**
   * Static methods for specific alert types
   */
  info: (props: Omit<IAlertModalProps, 'visible' | 'type'>) => void
  success: (props: Omit<IAlertModalProps, 'visible' | 'type'>) => void
  warning: (props: Omit<IAlertModalProps, 'visible' | 'type'>) => void
  error: (props: Omit<IAlertModalProps, 'visible' | 'type'>) => void
}

/**
 * AlertModal Component
 * 
 * A reusable alert modal component for displaying information, success, warning, or error messages.
 * 
 * Usage patterns:
 * 
 * 1. Component Usage (controlled):
 *    ```tsx
 *    const [visible, setVisible] = useState(false)
 *    
 *    <AlertModal
 *      visible={visible}
 *      type="success"
 *      title="Thành công"
 *      content="Dữ liệu đã được lưu thành công!"
 *      onOk={() => setVisible(false)}
 *    />
 *    ```
 * 
 * 2. Static Method Usage (uncontrolled):
 *    ```tsx
 *    AlertModal.success({
 *      title: "Thành công",
 *      content: "Dữ liệu đã được lưu thành công!"
 *    })
 *    
 *    AlertModal.error({
 *      title: "Lỗi",
 *      content: "Không thể kết nối đến server!"
 *    })
 *    ```
 * 
 * Features:
 * - Vietnamese localization by default
 * - Four alert types: info, success, warning, error
 * - Async onOk support with error handling
 * - Auto-styled icons based on type
 * - Automatic error logging
 */
const AlertModal: IAlertModalComponent = ({
  title,
  content,
  type = 'info',
  okText = defaultTexts.ok,
  icon,
  onOk,
  visible = false,
  loading = false
}) => {
  // Show modal when visible prop is true
  if (visible) {
    showInfoModal({
      title,
      icon: icon || getAlertIcon(type),
      content,
      okText,
      onOk,
      loading
    })
  }

  return null
}

/**
 * Static method to show alert modal directly
 */
AlertModal.show = (props: Omit<IAlertModalProps, 'visible'>) => {
  showInfoModal({
    title: props.title,
    icon: props.icon || getAlertIcon(props.type || 'info'),
    content: props.content,
    okText: props.okText || defaultTexts.ok,
    onOk: props.onOk,
    loading: props.loading
  })
}

/**
 * Static method for info alerts
 */
AlertModal.info = (props: Omit<IAlertModalProps, 'visible' | 'type'>) => {
  AlertModal.show({ ...props, type: 'info' })
}

/**
 * Static method for success alerts
 */
AlertModal.success = (props: Omit<IAlertModalProps, 'visible' | 'type'>) => {
  AlertModal.show({ ...props, type: 'success' })
}

/**
 * Static method for warning alerts
 */
AlertModal.warning = (props: Omit<IAlertModalProps, 'visible' | 'type'>) => {
  AlertModal.show({ ...props, type: 'warning' })
}

/**
 * Static method for error alerts
 */
AlertModal.error = (props: Omit<IAlertModalProps, 'visible' | 'type'>) => {
  AlertModal.show({ ...props, type: 'error' })
}

export default AlertModal
export type { AlertType } from './types' 