import { InfoCircleOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import React from 'react'
import { IWidthModalProps, IModalComponent } from './types'
import { showInfoModal, defaultTexts } from './utils'

const { Paragraph } = Typography

/**
 * Props interface for MessageModal component
 */
export interface IMessageModalProps extends IWidthModalProps {
  /** Message content - can be string or React node */
  content: React.ReactNode
  /** Additional details or description */
  description?: React.ReactNode
  /** Whether content should be copyable */
  copyable?: boolean
  /** Whether content should be scrollable */
  scrollable?: boolean
  /** Maximum height for scrollable content */
  maxHeight?: number
}

/**
 * MessageModal component interface with static show method
 */
interface IMessageModalComponent extends IModalComponent<IMessageModalProps> {}

/**
 * MessageModal Component
 * 
 * A reusable message modal component for displaying detailed information, logs, or messages.
 * 
 * Usage patterns:
 * 
 * 1. Component Usage (controlled):
 *    ```tsx
 *    const [visible, setVisible] = useState(false)
 *    
 *    <MessageModal
 *      visible={visible}
 *      title="Thông tin chi tiết"
 *      content="Đây là nội dung thông báo dài..."
 *      description="Mô tả bổ sung"
 *      copyable
 *      scrollable
 *      onOk={() => setVisible(false)}
 *    />
 *    ```
 * 
 * 2. Static Method Usage (uncontrolled):
 *    ```tsx
 *    MessageModal.show({
 *      title: "Thông tin chi tiết",
 *      content: "Đây là nội dung thông báo dài...",
 *      description: "Mô tả bổ sung",
 *      copyable: true,
 *      scrollable: true
 *    })
 *    ```
 * 
 * Features:
 * - Vietnamese localization by default
 * - Scrollable content for long messages
 * - Copyable text support
 * - Customizable width and height
 * - Async onOk support with error handling
 * - Loading state support
 */
const MessageModal: IMessageModalComponent = ({
  title,
  content,
  description,
  okText = defaultTexts.close,
  width = 520,
  icon = React.createElement(InfoCircleOutlined),
  onOk,
  visible = false,
  loading = false,
  copyable = false,
  scrollable = false,
  maxHeight = 400
}) => {
  /**
   * Render content with appropriate wrapper
   */
  const renderContent = () => {
    const contentStyle: React.CSSProperties = {
      ...(scrollable && {
        maxHeight,
        overflowY: 'auto',
        padding: '8px 0'
      })
    }

    return (
      <div style={contentStyle}>
        {description && (
          <Paragraph style={{ marginBottom: 16, color: '#666' }}>
            {description}
          </Paragraph>
        )}
        
        {typeof content === 'string' ? (
          <Paragraph copyable={copyable}>
            {content}
          </Paragraph>
        ) : (
          <div>
            {content}
          </div>
        )}
      </div>
    )
  }

  // Show modal when visible prop is true
  if (visible) {
    showInfoModal({
      title,
      content: renderContent(),
      width,
      okText,
      onOk,
      loading,
      icon
    })
  }

  return null
}

/**
 * Static method to show message modal directly
 */
MessageModal.show = (props: Omit<IMessageModalProps, 'visible'>) => {
  const contentStyle: React.CSSProperties = {
    ...(props.scrollable && {
      maxHeight: props.maxHeight || 400,
      overflowY: 'auto',
      padding: '8px 0'
    })
  }

  const content = (
    <div style={contentStyle}>
      {props.description && (
        <Paragraph style={{ marginBottom: 16, color: '#666' }}>
          {props.description}
        </Paragraph>
      )}
      
      {typeof props.content === 'string' ? (
        <Paragraph copyable={props.copyable}>
          {props.content}
        </Paragraph>
      ) : (
        <div>
          {props.content}
        </div>
      )}
    </div>
  )

  showInfoModal({
    title: props.title,
    icon: props.icon || React.createElement(InfoCircleOutlined),
    content,
    width: props.width || 520,
    okText: props.okText || defaultTexts.close,
    onOk: props.onOk,
    loading: props.loading
  })
}

export default MessageModal 