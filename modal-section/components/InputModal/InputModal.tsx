import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Input, Modal } from 'antd'
import React from 'react'
import { IValidatableModalProps, IModalComponent } from '../../shared'

const { TextArea } = Input

/**
 * Props for InputModal component
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
 * InputModal component interface
 */
interface IInputModalComponent extends IModalComponent<IInputModalProps> { }

// Default texts
const defaultTexts = {
  confirm: 'Xác nhận',
  cancel: 'Hủy'
}

/**
 * InputModal Component
 * 
 * A reusable input modal component for collecting single text input from users.
 * Includes automation test support via data-testid attributes.
 * 
 * Features:
 * - Vietnamese localization by default
 * - Support for text input and textarea
 * - Built-in validation with custom validator support
 * - Password input support
 * - Character limit support
 * - Loading state management
 * - Automation testing support with data-testid
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
  const [inputValue, setInputValue] = React.useState(defaultValue)
  const [validationError, setValidationError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (visible) {
      setInputValue(defaultValue)
      setValidationError(null)

      // Add data-testid after modal renders
      setTimeout(() => {
        const modalElement = document.querySelector('.input-modal')
        if (modalElement) {
          modalElement.setAttribute('data-testid', 'input-modal')

          // Add data-testid to buttons
          const okButton = modalElement.querySelector('.ant-btn-primary')
          if (okButton) {
            okButton.setAttribute('data-testid', 'input-modal-ok-btn')
          }

          const cancelButton = modalElement.querySelector('.ant-btn:not(.ant-btn-primary)')
          if (cancelButton) {
            cancelButton.setAttribute('data-testid', 'input-modal-cancel-btn')
          }

          // Add data-testid to input/textarea
          const inputElement = modalElement.querySelector('.ant-input')
          if (inputElement) {
            inputElement.setAttribute('data-testid', textArea ? 'input-modal-textarea' : 'input-modal-input')
          }
        }
      }, 100)
    }
  }, [visible, defaultValue, textArea])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setValidationError(null)
  }

  const handleCancel = () => {
    setInputValue(defaultValue)
    setValidationError(null)
    onCancel?.()
  }

  const validateInput = (value: string): string | null => {
    if (required && !value.trim()) {
      return 'Vui lòng nhập thông tin'
    }

    if (validator) {
      return validator(value)
    }

    return null
  }

  const handleOk = async () => {
    const error = validateInput(inputValue)
    if (error) {
      setValidationError(error)
      return
    }

    try {
      await onOk(inputValue)
    } catch (error) {
      console.error('Input modal error:', error)
    }
  }

  const renderInput = () => {
    const commonProps = {
      value: inputValue,
      onChange: handleInputChange,
      placeholder,
      maxLength,
      status: validationError ? 'error' as const : undefined,
      'data-testid': textArea ? 'input-modal-textarea' : 'input-modal-input'
    }

    if (textArea) {
      return <TextArea {...commonProps} rows={rows} />
    }

    return <Input {...commonProps} type={inputType} />
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span>{title}</span>
        </div>
      }
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={loading}
      wrapClassName="input-modal"
    >
      <div data-testid="input-modal-content">
        {label && (
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }} data-testid="input-modal-label">
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
          </div>
        )}

        {renderInput()}

        {validationError && (
          <div style={{ color: 'red', marginTop: '4px', fontSize: '12px' }} data-testid="input-modal-error">
            {validationError}
          </div>
        )}

        {maxLength && (
          <div style={{ textAlign: 'right', marginTop: '4px', fontSize: '12px', color: '#999' }} data-testid="input-modal-counter">
            {inputValue.length}/{maxLength}
          </div>
        )}
      </div>
    </Modal>
  )
}

/**
 * Static show method for programmatic usage
 */
InputModal.show = (props: Omit<IInputModalProps, 'visible'>) => {
  let inputValue = props.defaultValue || ''
  let validationError: string | null = null

  const validateInput = (value: string): string | null => {
    if (props.required && !value.trim()) {
      return 'Vui lòng nhập thông tin'
    }

    if (props.validator) {
      return props.validator(value)
    }

    return null
  }

  const content = (
    <div data-testid="input-modal-content">
      {props.label && (
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }} data-testid="input-modal-label">
          {props.label}
          {props.required && <span style={{ color: 'red' }}> *</span>}
        </div>
      )}

      {props.textArea ? (
        <TextArea
          defaultValue={inputValue}
          onChange={(e) => {
            inputValue = e.target.value
            validationError = null
          }}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          rows={props.rows || 3}
          data-testid="input-modal-textarea"
        />
      ) : (
        <Input
          defaultValue={inputValue}
          onChange={(e) => {
            inputValue = e.target.value
            validationError = null
          }}
          placeholder={props.placeholder}
          type={props.inputType || 'text'}
          maxLength={props.maxLength}
          data-testid="input-modal-input"
        />
      )}
    </div>
  )

  const modalRef = Modal.confirm({
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {props.icon || React.createElement(ExclamationCircleOutlined)}
        <span>{props.title}</span>
      </div>
    ),
    content,
    okText: props.okText || defaultTexts.confirm,
    cancelText: props.cancelText || defaultTexts.cancel,
    onOk: async () => {
      const error = validateInput(inputValue);
      if (error) {
        // validationError = error;
        // Display validation error (you might want to update the modal content to show this)
        console.warn('Validation error:', error);
        // Return false to prevent modal from closing
        return false;
      }

      try {
        // If the consumer's onOk is successful, allow the modal to close
        await props.onOk(inputValue);
        return true; // Allow modal to close
      } catch (err) {
        // If the consumer's onOk fails, keep the modal open
        console.error('Input modal error:', err);
        return false; // Prevent modal from closing
      }
    },
    onCancel: props.onCancel,
    wrapClassName: 'input-modal'
  })

  // Add data-testid to the modal container after it's created
  setTimeout(() => {
    const modalElement = document.querySelector('.input-modal')
    if (modalElement) {
      modalElement.setAttribute('data-testid', 'input-modal')

      // Add data-testid to buttons
      const okButton = modalElement.querySelector('.ant-btn-primary')
      if (okButton) {
        okButton.setAttribute('data-testid', 'input-modal-ok-btn')
      }

      const cancelButton = modalElement.querySelector('.ant-btn:not(.ant-btn-primary)')
      if (cancelButton) {
        cancelButton.setAttribute('data-testid', 'input-modal-cancel-btn')
      }
    }
  }, 100)

  return modalRef
}

export default InputModal