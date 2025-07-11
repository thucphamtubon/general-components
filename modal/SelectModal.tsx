import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import React from 'react'
import { IValidatableModalProps, ISelectOption, IModalComponent } from './types'
import { showConfirmModal, showValidationError, defaultTexts } from './utils'
import { useModalState } from './hooks'

const { Option } = Select

/**
 * Props interface for SelectModal component
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
 * SelectModal component interface with static show method
 */
interface ISelectModalComponent extends IModalComponent<ISelectModalProps> {}

/**
 * SelectModal Component
 * 
 * A reusable select modal component for choosing from a list of options.
 * 
 * Usage patterns:
 * 
 * 1. Component Usage (controlled):
 *    ```tsx
 *    const [visible, setVisible] = useState(false)
 *    
 *    const options = [
 *      { value: '1', label: 'Option 1' },
 *      { value: '2', label: 'Option 2' }
 *    ]
 *    
 *    <SelectModal
 *      visible={visible}
 *      title="Chọn tùy chọn"
 *      label="Danh sách tùy chọn"
 *      options={options}
 *      required
 *      showSearch
 *      onOk={async (value, option) => {
 *        await saveSelection(value)
 *        setVisible(false)
 *      }}
 *      onCancel={() => setVisible(false)}
 *    />
 *    ```
 * 
 * 2. Static Method Usage (uncontrolled):
 *    ```tsx
 *    SelectModal.show({
 *      title: "Chọn tùy chọn",
 *      options: [
 *        { value: '1', label: 'Option 1' },
 *        { value: '2', label: 'Option 2' }
 *      ],
 *      showSearch: true,
 *      onOk: async (value, option) => {
 *        await saveSelection(value)
 *      }
 *    })
 *    ```
 * 
 * Features:
 * - Vietnamese localization by default
 * - Search functionality for options
 * - Required selection validation
 * - Single and multiple selection modes
 * - Async onOk support with error handling
 * - Loading state support
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
  const modalState = useModalState({
    defaultValue,
    required,
    customValidator: (value) => {
      if (required && (value === undefined || value === null || value === '')) {
        return 'Vui lòng chọn một tùy chọn'
      }
      return null
    },
    errorContext: 'Select Modal'
  })

  /**
   * Handle selection change
   */
  const handleSelectChange = (value: string | number) => {
    modalState.handleChange(value)
  }

  /**
   * Handle confirm with option lookup
   */
  const handleConfirm = async (value: string | number) => {
    const selectedOption = options.find(opt => opt.value === value)
    if (selectedOption) {
      await onOk(value, selectedOption)
    }
  }

  /**
   * Filter option based on search input
   */
  const filterOption = (input: string, option: any) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
        <Select
          value={modalState.value}
          onChange={handleSelectChange}
          placeholder={placeholder}
          style={{ width: '100%' }}
          showSearch={showSearch}
          filterOption={showSearch ? filterOption : false}
          status={modalState.error ? 'error' : ''}
          mode={mode === 'multiple' ? 'multiple' : undefined}
        >
          {options.map(option => (
            <Option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </Option>
          ))}
        </Select>
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
      onOk: modalState.createValidatedHandler(handleConfirm),
      onCancel: handleCancel,
      loading
    })
  }

  return null
}

/**
 * Static method to show select modal directly
 */
SelectModal.show = (props: Omit<ISelectModalProps, 'visible'>) => {
  let selectedValue: string | number | undefined = props.defaultValue

  const validateSelection = (value: string | number | undefined): string | null => {
    if (props.required && (value === undefined || value === null || value === '')) {
      return 'Vui lòng chọn một tùy chọn'
    }
    
    return null
  }

  const handleOk = async () => {
    const validationError = validateSelection(selectedValue)
    if (validationError) {
      showValidationError(validationError, 'Lỗi lựa chọn')
      return
    }

    try {
      const selectedOption = props.options.find(opt => opt.value === selectedValue)
      if (selectedOption) {
        await props.onOk(selectedValue!, selectedOption)
      }
    } catch (error) {
      console.error('Select modal error:', error)
    }
  }

  const filterOption = (input: string, option: any) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const content = (
    <div>
      {props.label && <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{props.label}</div>}
      <Select
        defaultValue={props.defaultValue}
        onChange={(value) => { selectedValue = value }}
        placeholder={props.placeholder || 'Chọn một tùy chọn...'}
        style={{ width: '100%' }}
        showSearch={props.showSearch}
        filterOption={props.showSearch ? filterOption : false}
        mode={props.mode === 'multiple' ? 'multiple' : undefined}
      >
        {props.options.map(option => (
          <Option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </Option>
        ))}
      </Select>
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
}

export default SelectModal 