import { InfoCircleOutlined } from '@ant-design/icons'
import { Modal, Typography } from 'antd'
import React from 'react'
import { IModalComponent, IWidthModalProps } from '../../shared'

const { Paragraph } = Typography

/**
 * Props for MessageModal component
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
 * MessageModal component interface
 */
interface IMessageModalComponent extends IModalComponent<IMessageModalProps> { }

// Default texts
const defaultTexts = {
  close: 'Đóng'
}

/**
 * MessageModal Component
 * 
 * A reusable message modal component for displaying information, text content, or messages.
 * Includes automation test support via data-testid attributes.
 * 
 * Features:
 * - Vietnamese localization by default
 * - Copyable content support
 * - Scrollable content for long messages
 * - Custom width support
 * - Rich content support (React nodes)
 * - Automation testing support with data-testid
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

  React.useEffect(() => {
    if (visible) {
      // Add data-testid after modal renders
      setTimeout(() => {
        const modalElement = document.querySelector('.message-modal')
        if (modalElement) {
          modalElement.setAttribute('data-testid', 'message-modal')

          // Add data-testid to buttons
          const okButton = modalElement.querySelector('.ant-btn-primary')
          if (okButton) {
            okButton.setAttribute('data-testid', 'message-modal-ok-btn')
          }
        }
      }, 100)
    }
  }, [visible])

  const renderContent = () => {
    const contentStyle = scrollable ? {
      maxHeight: `${maxHeight}px`,
      overflowY: 'auto' as const,
      marginBottom: description ? '16px' : 0
    } : {
      marginBottom: description ? '16px' : 0
    }

    return (
      <div data-testid="message-modal-content">
        <div style={contentStyle} data-testid="message-modal-main-content">
          {typeof content === 'string' && copyable ? (
            <Paragraph copyable data-testid="message-modal-copyable-text">
              {content}
            </Paragraph>
          ) : (
            <div data-testid="message-modal-text">
              {content}
            </div>
          )}
        </div>

        {description && (
          <div style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: '16px',
            color: '#666',
            fontSize: '14px'
          }} data-testid="message-modal-description">
            {description}
          </div>
        )}
      </div>
    )
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span>{title}</span>
        </div>
      }
      width={width}
      open={visible}
      onOk={onOk}
      onCancel={onOk} // Message modal only has close button
      okText={okText}
      cancelButtonProps={{ style: { display: 'none' } }} // Hide cancel button
      confirmLoading={loading}
      wrapClassName="message-modal"
    >
      {renderContent()}
    </Modal>
  )
}

/**
 * Static show method for programmatic usage
 */
MessageModal.show = (props: Omit<IMessageModalProps, 'visible'>) => {
  const renderContent = () => {
    const contentStyle = props.scrollable ? {
      maxHeight: `${props.maxHeight || 400}px`,
      overflowY: 'auto' as const,
      marginBottom: props.description ? '16px' : 0
    } : {
      marginBottom: props.description ? '16px' : 0
    }

    return (
      <div data-testid="message-modal-content">
        <div style={contentStyle} data-testid="message-modal-main-content">
          {typeof props.content === 'string' && props.copyable ? (
            <Paragraph copyable data-testid="message-modal-copyable-text">
              {props.content}
            </Paragraph>
          ) : (
            <div data-testid="message-modal-text">
              {props.content}
            </div>
          )}
        </div>

        {props.description && (
          <div style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: '16px',
            color: '#666',
            fontSize: '14px'
          }} data-testid="message-modal-description">
            {props.description}
          </div>
        )}
      </div>
    )
  }

  const modalRef = Modal.info({
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {props.icon || React.createElement(InfoCircleOutlined)}
        <span>{props.title}</span>
      </div>
    ),
    content: renderContent(),
    width: props.width || 520,
    okText: props.okText || defaultTexts.close,
    onOk: props.onOk,
    wrapClassName: 'message-modal'
  })

  // Add data-testid to the modal container after it's created
  setTimeout(() => {
    const modalElement = document.querySelector('.message-modal')
    if (modalElement) {
      modalElement.setAttribute('data-testid', 'message-modal')

      // Add data-testid to OK button
      const okButton = modalElement.querySelector('.ant-btn-primary')
      if (okButton) {
        okButton.setAttribute('data-testid', 'message-modal-ok-btn')
      }
    }
  }, 100)

  return modalRef
}

export default MessageModal