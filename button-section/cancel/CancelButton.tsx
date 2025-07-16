import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface CancelButtonProps extends ButtonProps {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Button text content
   */
  children: React.ReactNode;
  /**
   * Cancel button variant
   */
  variant?: 'default' | 'text' | 'link';
  /**
   * Form name for identification
   */
  formName?: string;
  /**
   * Confirmation before cancel
   */
  confirmCancel?: boolean;
  /**
   * Confirmation message
   */
  confirmMessage?: string;
}

/**
 * Cancel Button Component
 * Sử dụng cho việc hủy bỏ các hành động, form, modal
 */
const CancelButton: React.FC<CancelButtonProps> = ({
  testId,
  children,
  className = '',
  variant = 'default',
  formName,
  confirmCancel = false,
  confirmMessage = 'Bạn có chắc chắn muốn hủy bỏ?',
  onClick,
  ...props
}) => {
  // Generate default testId
  const defaultTestId = testId || (formName ? `cancel-button-${formName}` : 'cancel-button');

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (confirmCancel) {
      if (window.confirm(confirmMessage)) {
        onClick?.(e);
      }
    } else {
      onClick?.(e);
    }
  };

  return (
    <Button
      type={variant}
      data-testid={defaultTestId}
      className={`cancel-button ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CancelButton;