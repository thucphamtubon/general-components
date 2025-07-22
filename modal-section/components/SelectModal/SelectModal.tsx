import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal, Select } from 'antd'
import React from 'react'
import { IValidatableModalProps, IModalComponent } from '../../shared'
import { ISelectOption } from '../../shared/types'

const { Option } = Select

/**
 * Props for SelectModal component
 */
export interface ISelectModalProps extends IValidatableModalProps {
  /** Label for the select field */
  label?: string
  /** Placeholder text for select */
  placeholder?: string
  /** Array of options to choose from */
  options: ISelectOption[]
  /** Default selected value */
  defaultValue?: string | number
  /** Function to execute when user clicks confirm */
  onOk: (selectedValue: string | number, selectedOption: ISelectOption) => Promise<void> | void
  /** Whether to allow multiple selection */
  mode?: 'single' | 'multiple'
  /** Whether to show search functionality */
  showSearch?: boolean
}

/**
 * SelectModal component interface
 */
interface ISelectModalComponent extends IModalComponent<ISelectModalProps> { }

// Default texts
const defaultTexts = {
  confirm: 'Xác nhận',
  cancel: 'Hủy'
}

/**
 * SelectModal Component
 * 
 * A reusable select modal component for choosing from predefined options.
 * Includes automation test support via data-testid attributes.
 * 
 * Features:
 * - Vietnamese localization by default
 * - Single and multiple selection modes
 * - Search functionality within options
 * - Built-in validation with custom validator support
 * - Required field validation
 * - Loading state management
 * - Automation testing support with data-testid
 */
const SelectModal: ISelectModalComponent = ({
  title,
  label,
  placeholder = 'Chọn một tùy chọn...',
  options,
  defaultValue,
  okText = defaultTexts.confirm,
  cancelText = defaultTexts.cancel,
  icon = React.createElement(ExclamationCircleOutlined),
  onOk,
  onCancel,
  required = false,
  mode = 'single',
  showSearch = false,
  visible = false,
  loading = false
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string | number | undefined>(defaultValue)
  const [validationError, setValidationError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (visible) {
      setSelectedValue(defaultValue)
      setValidationError(null)

      // Add data-testid after modal renders
      setTimeout(() => {
        const modalElement = document.querySelector('.select-modal')
        if (modalElement) {
          modalElement.setAttribute('data-testid', 'select-modal')

          // Add data-testid to buttons
          const okButton = modalElement.querySelector('.ant-btn-primary')
          if (okButton) {
            okButton.setAttribute('data-testid', 'select-modal-ok-btn')
          }

          const cancelButton = modalElement.querySelector('.ant-btn:not(.ant-btn-primary)')
          if (cancelButton) {
            cancelButton.setAttribute('data-testid', 'select-modal-cancel-btn')
          }

          // Add data-testid to select
          const selectElement = modalElement.querySelector('.ant-select')
          if (selectElement) {
            selectElement.setAttribute('data-testid', 'select-modal-select')
          }
        }
      }, 100)
    }
  }, [visible, defaultValue])

  const handleSelectChange = (value: string | number) => {
    setSelectedValue(value)
    setValidationError(null)
  }

  const handleConfirm = async (value: string | number) => {
    const selectedOption = options.find(option => option.value === value)
    if (selectedOption) {
      await onOk(value, selectedOption)
    }
  }

  const filterOption = (input: string, option: any) => {
    return option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const handleCancel = () => {
    setSelectedValue(defaultValue)
    setValidationError(null)
    onCancel?.()
  }

  const validateSelection = (value: string | number | undefined): string | null => {
    if (required && (value === undefined || value === null || value === '')) {
      return 'Vui lòng chọn một tùy chọn'
    }
    return null
  }

  const handleOk = async () => {
    const error = validateSelection(selectedValue)
    if (error) {
      setValidationError(error)
      return
    }

    if (selectedValue !== undefined && selectedValue !== null) {
      try {
        await handleConfirm(selectedValue)
      } catch (error) {
        console.error('Select modal error:', error)
      }
    }
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
      wrapClassName="select-modal"
    >
      <div data-testid="select-modal-content">
        {label && (
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }} data-testid="select-modal-label">
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
          </div>
        )}

        <Select
          style={{ width: '100%' }}
          placeholder={placeholder}
          value={selectedValue}
          onChange={handleSelectChange}
          showSearch={showSearch}
          filterOption={filterOption}
          mode={mode === 'multiple' ? 'multiple' : undefined}
          status={validationError ? 'error' : undefined}
          data-testid="select-modal-select"
        >
          {options.map(option => (
            <Option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              data-testid={`select-modal-option-${option.value}`}
            >
              {option.label}
            </Option>
          ))}
        </Select>

        {validationError && (
          <div style={{ color: 'red', marginTop: '4px', fontSize: '12px' }} data-testid="select-modal-error">
            {validationError}
          </div>
        )}
      </div>
    </Modal>
  )
}

/**
 * Static show method for programmatic usage
 */
SelectModal.show = (props: Omit<ISelectModalProps, 'visible'>) => {
  let selectedValue: string | number | undefined = props.defaultValue
  let validationError: string | null = null

  const validateSelection = (value: string | number | undefined): string | null => {
    if (props.required && (value === undefined || value === null || value === '')) {
      return 'Vui lòng chọn một tùy chọn'
    }
    return null
  }

  const filterOption = (input: string, option: any) => {
    return option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const content = (
    <div data-testid="select-modal-content">
      {props.label && (
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }} data-testid="select-modal-label">
          {props.label}
          {props.required && <span style={{ color: 'red' }}> *</span>}
        </div>
      )}

      <Select
        style={{ width: '100%' }}
        placeholder={props.placeholder || 'Chọn một tùy chọn...'}
        defaultValue={selectedValue}
        onChange={(value) => {
          selectedValue = value
          validationError = null
        }}
        showSearch={props.showSearch}
        filterOption={filterOption}
        mode={props.mode === 'multiple' ? 'multiple' : undefined}
        data-testid="select-modal-select"
      >
        {props.options.map(option => (
          <Option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            data-testid={`select-modal-option-${option.value}`}
          >
            {option.label}
          </Option>
        ))}
      </Select>
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
      const error = validateSelection(selectedValue)
      if (error) {
        // validationError = error
        throw new Error(error) // Prevent modal from closing
      }

      if (selectedValue !== undefined && selectedValue !== null) {
        const selectedOption = props.options.find(option => option.value === selectedValue)
        if (selectedOption) {
          try {
            await props.onOk(selectedValue, selectedOption)
          } catch (error) {
            console.error('Select modal error:', error)
            throw error
          }
        }
      }
    },
    onCancel: props.onCancel,
    wrapClassName: 'select-modal'
  })

  // Add data-testid to the modal container after it's created
  setTimeout(() => {
    const modalElement = document.querySelector('.select-modal')
    if (modalElement) {
      modalElement.setAttribute('data-testid', 'select-modal')

      // Add data-testid to buttons
      const okButton = modalElement.querySelector('.ant-btn-primary')
      if (okButton) {
        okButton.setAttribute('data-testid', 'select-modal-ok-btn')
      }

      const cancelButton = modalElement.querySelector('.ant-btn:not(.ant-btn-primary)')
      if (cancelButton) {
        cancelButton.setAttribute('data-testid', 'select-modal-cancel-btn')
      }
    }
  }, 100)

  return modalRef
}

export default SelectModal