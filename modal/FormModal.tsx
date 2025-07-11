import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Form, Modal } from 'antd'
import React, { ReactNode } from 'react'
import { IWidthModalProps, IModalComponent } from './types'
import { handleModalError, defaultTexts } from './utils'

/**
 * Props interface for FormModal component
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
 * FormModal component interface with static show method
 */
interface IFormModalComponent extends IModalComponent<IFormModalProps> {}

/**
 * FormModal Component
 * 
 * A reusable form modal component for complex form inputs using Ant Design Form.
 * 
 * Usage patterns:
 * 
 * 1. Component Usage (controlled):
 *    ```tsx
 *    const [visible, setVisible] = useState(false)
 *    const [form] = Form.useForm()
 *    
 *    <FormModal
 *      visible={visible}
 *      title="Thêm người dùng"
 *      form={form}
 *      initialValues={{ name: '', email: '' }}
 *      onOk={async (values) => {
 *        await saveUser(values)
 *        setVisible(false)
 *      }}
 *      onCancel={() => setVisible(false)}
 *    >
 *      <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
 *        <Input />
 *      </Form.Item>
 *      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
 *        <Input />
 *      </Form.Item>
 *    </FormModal>
 *    ```
 * 
 * 2. Static Method Usage (uncontrolled):
 *    ```tsx
 *    FormModal.show({
 *      title: "Thêm người dùng",
 *      initialValues: { name: '', email: '' },
 *      children: (
 *        <>
 *          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
 *            <Input />
 *          </Form.Item>
 *          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
 *            <Input />
 *          </Form.Item>
 *        </>
 *      ),
 *      onOk: async (values) => {
 *        await saveUser(values)
 *      }
 *    })
 *    ```
 * 
 * Features:
 * - Vietnamese localization by default
 * - Full Ant Design Form integration
 * - Form validation support
 * - Async onOk support with error handling
 * - Loading state support
 * - Form field destruction on close
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

  /**
   * Handle confirm button click with form validation
   */
  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await onOk(values)
    } catch (error: any) {
      handleModalError(error, 'Form Modal')
    }
  }

  /**
   * Handle cancel - reset form if destroyOnClose is true
   */
  const handleCancel = () => {
    if (destroyOnClose) {
      form.resetFields()
    }
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <Modal
      title={title}
      open={visible}
      width={width}
      okText={okText}
      cancelText={cancelText}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose={destroyOnClose}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        preserve={!destroyOnClose}
      >
        {children}
      </Form>
    </Modal>
  )
}

/**
 * Static method to show form modal directly
 * Note: Static form modals have limitations compared to component usage.
 * For complex forms with validation, prefer using the component approach.
 */
FormModal.show = (props: Omit<IFormModalProps, 'visible'>) => {
  console.warn('FormModal.show: Static form modals have limitations. Consider using the component approach for better form handling.')
  
  let modalInstance: any = null
  let formData: Record<string, any> = { ...props.initialValues }

  const handleOk = async () => {
    try {
      // For static method, we pass the raw form data without validation
      // since we can't use Form.useForm() hook in static methods
      await props.onOk(formData)
      if (modalInstance) {
        modalInstance.destroy()
      }
    } catch (error: any) {
      handleModalError(error, 'Form Modal Static')
      if (modalInstance) {
        modalInstance.destroy()
      }
    }
  }

  const handleCancel = () => {
    if (modalInstance) {
      modalInstance.destroy()
    }
    if (props.onCancel) {
      props.onCancel()
    }
  }

  // Create a wrapper that provides form data collection capabilities
  const FormWrapper = () => {
    const [form] = Form.useForm()
    
    // Update formData when form values change
    const handleValuesChange = (changedValues: any, allValues: any) => {
      formData = allValues
    }

    React.useEffect(() => {
      if (props.initialValues) {
        form.setFieldsValue(props.initialValues)
        formData = { ...props.initialValues }
      }
    }, [])

    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={props.initialValues}
        onValuesChange={handleValuesChange}
      >
        {props.children}
      </Form>
    )
  }

  modalInstance = Modal.confirm({
    title: props.title,
    icon: props.icon || React.createElement(ExclamationCircleOutlined),
    content: React.createElement(FormWrapper),
    width: props.width || 520,
    okText: props.okText || defaultTexts.confirm,
    cancelText: props.cancelText || defaultTexts.cancel,
    onOk: handleOk,
    onCancel: handleCancel,
    okButtonProps: { loading: props.loading }
  })
}

export default FormModal 