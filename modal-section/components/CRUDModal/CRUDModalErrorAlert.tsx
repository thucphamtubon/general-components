import { Alert } from 'antd'
import React from 'react'
import { ICRUDModalErrorAlertProps } from './types'

/**
 * CRUDModalErrorAlert Component
 * 
 * Responsibility: Display error messages in CRUD modals
 * - Shows list of errors with appropriate styling
 * - Supports closable errors with onClose callback
 * - Provides consistent error display across CRUD operations
 * - Supports different error types (error, warning)
 * 
 * SRP: Single responsibility for error display only
 */
const CRUDModalErrorAlert: React.FC<ICRUDModalErrorAlertProps> = ({
  errors,
  onClose,
  showClose = true,
  type = 'error'
}) => {
  // Don't render if no errors
  if (!errors || errors.length === 0) {
    return null
  }

  // Single error - display as simple message
  if (errors.length === 1) {
    return (
      <Alert
        message={errors[0]}
        type={type}
        showIcon
        closable={showClose}
        onClose={onClose}
        style={{ marginBottom: 16 }}
        data-testid="crud-modal-error-alert-single"
      />
    )
  }

  // Multiple errors - display as list
  return (
    <Alert
      message={`Có ${errors.length} lỗi cần khắc phục:`}
      description={
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {errors.map((error, index) => (
            <li key={index} data-testid={`crud-modal-error-item-${index}`}>
              {error}
            </li>
          ))}
        </ul>
      }
      type={type}
      showIcon
      closable={showClose}
      onClose={onClose}
      style={{ marginBottom: 16 }}
      data-testid="crud-modal-error-alert-multiple"
    />
  )
}

export default CRUDModalErrorAlert 