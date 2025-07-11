import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import React, { useEffect, useRef } from 'react'
import { IValidatableModalProps, IModalComponent } from './types'
import { showConfirmModal, defaultTexts, showValidationError } from './utils'
import { useModalState } from './hooks'

/**
 * Props interface for InputModal component
 */
export interface IInputModalProps extends IValidatableModalProps {
  /** Label for the input field */
  label?: string
  /** Placeholder text for input */
  placeholder?: string
  /** Default value for input */
  defaultValue?: string
  /** Input type (text, password, etc.) */
  inputType?: 'text' | 'password' | 'email' | 'number'
  /** Use textarea (multiline input) */
  textArea?: boolean
  /** Number of rows for textarea (default: 3) */
  rows?: number
  /** Function to execute when user clicks confirm */
  onOk: (inputValue: string) => Promise<void> | void
  /** Maximum length for input */
  maxLength?: number
}

/**
 * InputModal component interface with static show method
 */
interface IInputModalComponent extends IModalComponent<IInputModalProps> { }

/**
 * InputModal Component
 * 
 * A reusable input modal component for collecting text input from users.
 * 
 * Usage patterns:
 * 
 * 1. Component Usage (controlled):
 *    ```tsx
 *    const [visible, setVisible] = useState(false)
 *    
 *    <InputModal
 *      visible={visible}
 *      title="Nhập tên"
 *      label="Tên người dùng"
 *      placeholder="Nhập tên..."
 *      required
 *      onOk={async (value) => {
 *        await saveUser(value)
 *        setVisible(false)
 *      }}
 *      onCancel={() => setVisible(false)}
 *    />
 *    ```
 * 
 * 2. Static Method Usage (uncontrolled):
 *    ```tsx
 *    InputModal.show({
 *      title: "Nhập tên",
 *      label: "Tên người dùng",
 *      placeholder: "Nhập tên...",
 *      required: true,
 *      onOk: async (value) => {
 *        await saveUser(value)
 *      }
 *    })
 *    ```
 * 
 * Features:
 * - Vietnamese localization by default
 * - Input validation with custom validator
 * - Required field validation
 * - Different input types support
 * - Async onOk support with error handling
 * - Loading state support
 */
const InputModal: IInputModalComponent = ({
  title,
  label,
  placeholder,
  defaultValue = '',
  inputType = 'text',
  okText = defaultTexts.confirm,
  cancelText = defaultTexts.cancel,
  icon = React.createElement(ExclamationCircleOutlined),
  onOk,
  onCancel,
  validator,
  required = false,
  maxLength,
  visible = false,
  loading = false,
  textArea = false,
  rows = 3
}) => {
  const inputRef = useRef<any>(null)
  const modalState = useModalState({
    defaultValue,
    required,
    customValidator: validator,
    errorContext: 'Input Modal'
  })

  // Focus input after modal renders
  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [visible])

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    modalState.handleChange(e.target.value)
  }

  /**
   * Handle modal cancel
   */
  const handleCancel = () => {
    modalState.reset()
    if (onCancel) onCancel()
  }

  // Show modal when visible prop is true
  if (visible) {
    const content = (
      <div>
        {label && <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{label}</div>}
        {textArea ? (
          <Input.TextArea
            ref={inputRef}
            value={modalState.value}
            onChange={handleInputChange}
            placeholder={placeholder}
            maxLength={maxLength}
            status={modalState.error ? 'error' : ''}
            rows={rows}
          />
        ) : (
          <Input
            ref={inputRef}
            value={modalState.value}
            onChange={handleInputChange}
            placeholder={placeholder}
            type={inputType}
            maxLength={maxLength}
            status={modalState.error ? 'error' : ''}
          />
        )}
        {modalState.error && (
          <div style={{ color: '#ff4d4f', marginTop: 4, fontSize: '12px' }}>
            {modalState.error}
          </div>
        )}
      </div>
    )

    showConfirmModal({
      title,
      icon,
      content,
      okText,
      cancelText,
      onOk: modalState.createValidatedHandler(onOk),
      onCancel: handleCancel,
      loading
    })
  }

  return null
}

/**
 * Static method to show input modal directly
 */
InputModal.show = (props: Omit<IInputModalProps, 'visible'>) => {
  let inputValue = props.defaultValue || ''
  let inputRef: any = null

  const validateInput = (value: string): string | null => {
    if (props.required && !value.trim()) {
      return 'Trường này là bắt buộc'
    }

    if (props.validator) {
      return props.validator(value)
    }

    return null
  }

  const handleOk = async () => {
    const validationError = validateInput(inputValue)
    if (validationError) {
      showValidationError(validationError)
      return
    }

    try {
      await props.onOk(inputValue)
    } catch (error) {
      console.error('Input modal error:', error)
    }
  }

  const content = (
    <div>
      {props.label && <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{props.label}</div>}
      {props.textArea ? (
        <Input.TextArea
          ref={(ref) => { inputRef = ref }}
          defaultValue={props.defaultValue}
          onChange={(e) => { inputValue = e.target.value }}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          rows={props.rows || 3}
        />
      ) : (
        <Input
          ref={(ref) => { inputRef = ref }}
          defaultValue={props.defaultValue}
          onChange={(e) => { inputValue = e.target.value }}
          placeholder={props.placeholder}
          type={props.inputType || 'text'}
          maxLength={props.maxLength}
        />
      )}
    </div>
  )

  showConfirmModal({
    title: props.title,
    icon: props.icon || React.createElement(ExclamationCircleOutlined),
    content,
    okText: props.okText || defaultTexts.confirm,
    cancelText: props.cancelText || defaultTexts.cancel,
    onOk: handleOk,
    onCancel: props.onCancel,
    loading: props.loading
  })

  // Focus input after modal renders for static method
  setTimeout(() => {
    if (inputRef) {
      inputRef.focus()
    }
  }, 100)
}

export default InputModal 