import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface SubmitButtonProps extends Omit<ButtonProps, 'htmlType'> {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Button text content
   */
  children: React.ReactNode;
  /**
   * Loading state for form submission
   */
  submitting?: boolean;
  /**
   * Text to show when submitting
   */
  submittingText?: string;
  /**
   * Form name for identification
   */
  formName?: string;
}

/**
 * Submit Button Component
 * Sử dụng cho việc submit form với trạng thái loading tự động
 */
const SubmitButton: React.FC<SubmitButtonProps> = ({
  testId,
  children,
  className = '',
  submitting = false,
  submittingText = 'Đang xử lý...',
  formName,
  ...props
}) => {
  // Generate default testId
  const defaultTestId = testId || (formName ? `submit-button-${formName}` : 'submit-button');

  return (
    <Button
      type="primary"
      htmlType="submit"
      loading={submitting}
      data-testid={defaultTestId}
      className={`submit-button ${className}`}
      {...props}
    >
      {submitting ? submittingText : children}
    </Button>
  );
};

export default SubmitButton;