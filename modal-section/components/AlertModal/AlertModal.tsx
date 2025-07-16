import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import React from 'react'
import { IContentModalProps, IModalComponent } from '../../shared'
import { AlertType } from '../../shared/types'

export interface IAlertModalProps extends IContentModalProps {
  /** Type of alert (affects icon and styling) */
  type?: AlertType
}

/**
 * AlertModal component with static methods for different alert types
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

// Default texts
const defaultTexts = {
  ok: 'OK'
}

// Icons for different alert types
const getIconForType = (type: AlertType): React.ReactElement => {
  switch (type) {
    case 'success':
      return React.createElement(ExclamationCircleOutlined, { style: { color: '#52c41a' } })
    case 'warning':
      return React.createElement(ExclamationCircleOutlined, { style: { color: '#faad14' } })
    case 'error':
      return React.createElement(ExclamationCircleOutlined, { style: { color: '#ff4d4f' } })
    case 'info':
    default:
      return React.createElement(ExclamationCircleOutlined, { style: { color: '#1890ff' } })
  }
}

// Static method implementation
const showAlert = (type: AlertType) => {
  return (props: Omit<IAlertModalProps, 'visible' | 'type'>) => {
    const modalRef = Modal.confirm({
      title: props.title,
      content: (
        <div data-testid={`alert-modal-${type}-content`}>
          {props.content}
        </div>
      ),
      okText: props.okText || defaultTexts.ok,
      icon: props.icon || getIconForType(type),
      onOk: props.onOk,
      wrapClassName: `alert-modal alert-modal-${type}`,
      okButtonProps: {
        className: `alert-modal-${type}-ok-btn`
      },
      cancelButtonProps: { style: { display: 'none' } }
    })
    
    // Add data-testid to the modal container after it's created
    setTimeout(() => {
      const modalElement = document.querySelector(`.alert-modal-${type}`)
      if (modalElement) {
        modalElement.setAttribute('data-testid', `alert-modal-${type}`)
        
        // Add data-testid to OK button
        const okButton = modalElement.querySelector('.ant-btn-primary')
        if (okButton) {
          okButton.setAttribute('data-testid', `alert-modal-${type}-ok-btn`)
        }
      }
    }, 100)
    
    return modalRef
  }
}

/**
 * AlertModal Component
 * 
 * A reusable alert modal component with different alert types
 * and automation test support via data-testid attributes
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
  const finalIcon = icon || getIconForType(type)

  React.useEffect(() => {
    if (visible) {
      // Add data-testid after modal renders
      setTimeout(() => {
        const modalElement = document.querySelector(`.alert-modal-${type}`)
        if (modalElement) {
          modalElement.setAttribute('data-testid', `alert-modal-${type}`)
          
          // Add data-testid to buttons
          const okButton = modalElement.querySelector('.ant-btn-primary')
          if (okButton) {
            okButton.setAttribute('data-testid', `alert-modal-${type}-ok-btn`)
          }
        }
      }, 100)
    }
  }, [visible, type])

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {finalIcon}
          <span>{title}</span>
        </div>
      }
      open={visible}
      onOk={onOk}
      onCancel={onOk} // Alert modal only has OK button
      okText={okText}
      cancelButtonProps={{ style: { display: 'none' } }} // Hide cancel button
      confirmLoading={loading}
      wrapClassName={`alert-modal alert-modal-${type}`}
    >
      <div data-testid={`alert-modal-${type}-content`}>
        {content}
      </div>
    </Modal>
  )
}

// Add show method as required by interface
AlertModal.show = (props: Omit<IAlertModalProps, 'visible'>) => {
  showAlert(props.type || 'info')(props)
}

// Attach static methods
AlertModal.info = showAlert('info')
AlertModal.success = showAlert('success')
AlertModal.warning = showAlert('warning')
AlertModal.error = showAlert('error')

export default AlertModal