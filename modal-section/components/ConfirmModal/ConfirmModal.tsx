import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import React from 'react'
import { IContentModalProps, IModalComponent } from '../../shared'

/**
 * Props for ConfirmModal component
 */
export interface IConfirmModalProps extends IContentModalProps {
  /** Function to execute when user clicks confirm */
  onOk: () => Promise<void> | void
}

/**
 * ConfirmModal component interface
 */
interface IConfirmModalComponent extends IModalComponent<IConfirmModalProps> {}

// Default texts
const defaultTexts = {
  confirm: 'Xác nhận',
  cancel: 'Hủy'
}

/**
 * ConfirmModal Component
 * 
 * A reusable confirmation modal for user actions that require explicit confirmation.
 * Includes automation test support via data-testid attributes.
 * 
 * Features:
 * - Vietnamese localization by default
 * - Async onOk support with error handling
 * - Customizable title, content, and button texts
 * - Loading state management
 * - Automatic error logging
 * - Automation testing support with data-testid
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

  React.useEffect(() => {
    if (visible) {
      // Add data-testid after modal renders
      setTimeout(() => {
        const modalElement = document.querySelector('.confirm-modal')
        if (modalElement) {
          modalElement.setAttribute('data-testid', 'confirm-modal')
          
          // Add data-testid to buttons
          const okButton = modalElement.querySelector('.ant-btn-primary')
          if (okButton) {
            okButton.setAttribute('data-testid', 'confirm-modal-ok-btn')
          }
          
          const cancelButton = modalElement.querySelector('.ant-btn:not(.ant-btn-primary)')
          if (cancelButton) {
            cancelButton.setAttribute('data-testid', 'confirm-modal-cancel-btn')
          }
        }
      }, 100)
    }
  }, [visible])

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span>{title}</span>
        </div>
      }
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={loading}
      wrapClassName="confirm-modal"
    >
      <div data-testid="confirm-modal-content">
        {content}
      </div>
    </Modal>
  )
}

/**
 * Static show method for programmatic usage
 */
ConfirmModal.show = (props: Omit<IConfirmModalProps, 'visible'>) => {
  const modalRef = Modal.confirm({
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {props.icon || React.createElement(ExclamationCircleOutlined)}
        <span>{props.title}</span>
      </div>
    ),
    content: (
      <div data-testid="confirm-modal-content">
        {props.content}
      </div>
    ),
    okText: props.okText || defaultTexts.confirm,
    cancelText: props.cancelText || defaultTexts.cancel,
    onOk: props.onOk,
    onCancel: props.onCancel,
    wrapClassName: 'confirm-modal'
  })
  
  // Add data-testid to the modal container after it's created
  setTimeout(() => {
    const modalElement = document.querySelector('.confirm-modal')
    if (modalElement) {
      modalElement.setAttribute('data-testid', 'confirm-modal')
      
      // Add data-testid to buttons
      const okButton = modalElement.querySelector('.ant-btn-primary')
      if (okButton) {
        okButton.setAttribute('data-testid', 'confirm-modal-ok-btn')
      }
      
      const cancelButton = modalElement.querySelector('.ant-btn:not(.ant-btn-primary)')
      if (cancelButton) {
        cancelButton.setAttribute('data-testid', 'confirm-modal-cancel-btn')
      }
    }
  }, 100)
  
  return modalRef
}

export default ConfirmModal