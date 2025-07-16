import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Form, Modal } from 'antd'
import React, { ReactNode } from 'react'
import { IWidthModalProps, IModalComponent } from '../../shared'

/**
 * Props for FormModal component  
 */
export interface IFormModalProps extends IWidthModalProps {
  /** Form content - React node containing form fields */
  children: ReactNode
  /** Function to execute when user clicks confirm - receives form values */
  onOk: (formValues: any) => Promise<void> | void
  /** Initial form values */
  initialValues?: any
  /** Form instance (optional - will create one if not provided) */
  form?: any
  /** Whether to destroy form fields when modal is closed */
  destroyOnClose?: boolean
}

/**
 * FormModal component interface
 */
interface IFormModalComponent extends IModalComponent<IFormModalProps> {}

// Default texts
const defaultTexts = {
  confirm: 'Xác nhận',
  cancel: 'Hủy'
}

/**
 * FormModal Component
 * 
 * A reusable form modal component for collecting user input through forms.
 * Includes automation test support via data-testid attributes.
 * 
 * Features:
 * - Vietnamese localization by default  
 * - Ant Design Form integration
 * - Async onOk support with form validation
 * - Automatic form validation before submission
 * - Loading state management
 * - Form persistence options
 * - Automation testing support with data-testid
 */
const FormModal: IFormModalComponent = ({
  title,
  width = 520,
  children,
  okText = defaultTexts.confirm,
  cancelText = defaultTexts.cancel,
  icon = React.createElement(ExclamationCircleOutlined),
  onOk,
  onCancel,
  initialValues,
  form: providedForm,
  visible = false,
  loading = false,
  destroyOnClose = true
}) => {
  const [internalForm] = Form.useForm()
  const form = providedForm || internalForm

  React.useEffect(() => {
    if (visible) {
      // Add data-testid after modal renders
      setTimeout(() => {
        const modalElement = document.querySelector('.form-modal')
        if (modalElement) {
          modalElement.setAttribute('data-testid', 'form-modal')
          
          // Add data-testid to buttons
          const okButton = modalElement.querySelector('.ant-btn-primary')
          if (okButton) {
            okButton.setAttribute('data-testid', 'form-modal-ok-btn')
          }
          
          const cancelButton = modalElement.querySelector('.ant-btn:not(.ant-btn-primary)')
          if (cancelButton) {
            cancelButton.setAttribute('data-testid', 'form-modal-cancel-btn')
          }

          // Add data-testid to form
          const formElement = modalElement.querySelector('.ant-form')
          if (formElement) {
            formElement.setAttribute('data-testid', 'form-modal-form')
          }
        }
      }, 100)
    }
  }, [visible])

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [visible, initialValues, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await onOk(values)
    } catch (error) {
      // Form validation failed or onOk threw an error
      console.error('Form validation error:', error)
    }
  }

  const handleCancel = () => {
    if (destroyOnClose) {
      form.resetFields()
    }
    onCancel?.()
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
      onOk={handleOk}
      onCancel={handleCancel}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={loading}
      destroyOnClose={destroyOnClose}
      wrapClassName="form-modal"
    >
      <div data-testid="form-modal-content">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          data-testid="form-modal-form"
        >
          {children}
        </Form>
      </div>
    </Modal>
  )
}

/**
 * Static show method for programmatic usage
 */
FormModal.show = (props: Omit<IFormModalProps, 'visible'>) => {
  // Use provided form or require it to be passed
  const formRef = props.form
  
  if (!formRef) {
    console.warn('FormModal.show requires a form instance to be passed via props.form')
    return
  }

  const modalRef = Modal.confirm({
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {props.icon || React.createElement(ExclamationCircleOutlined)}
        <span>{props.title}</span>
      </div>
    ),
    content: (
      <div data-testid="form-modal-content">
        <Form
          form={formRef}
          layout="vertical"
          initialValues={props.initialValues}
          data-testid="form-modal-form"
        >
          {props.children}
        </Form>
      </div>
    ),
    width: props.width || 520,
    okText: props.okText || defaultTexts.confirm,
    cancelText: props.cancelText || defaultTexts.cancel,
    onOk: async () => {
      try {
        const values = await formRef.validateFields()
        await props.onOk(values)
      } catch (error) {
        console.error('Form validation error:', error)
        throw error // Re-throw to prevent modal from closing
      }
    },
    onCancel: () => {
      if (props.destroyOnClose !== false) {
        formRef.resetFields()
      }
      props.onCancel?.()
    },
    wrapClassName: 'form-modal'
  })

  // Add data-testid to the modal container after it's created
  setTimeout(() => {
    const modalElement = document.querySelector('.form-modal')
    if (modalElement) {
      modalElement.setAttribute('data-testid', 'form-modal')
      
      // Add data-testid to buttons
      const okButton = modalElement.querySelector('.ant-btn-primary')
      if (okButton) {
        okButton.setAttribute('data-testid', 'form-modal-ok-btn')
      }
      
      const cancelButton = modalElement.querySelector('.ant-btn:not(.ant-btn-primary)')
      if (cancelButton) {
        cancelButton.setAttribute('data-testid', 'form-modal-cancel-btn')
      }
    }
  }, 100)

  return modalRef
}

export default FormModal