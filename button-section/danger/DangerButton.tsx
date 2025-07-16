import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface DangerButtonProps extends Omit<ButtonProps, 'type' | 'danger'> {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Button text content
   */
  children: React.ReactNode;
  /**
   * Button variant - primary danger or default danger
   */
  variant?: 'primary' | 'default';
}

/**
 * Danger Button Component
 * Sử dụng cho các hành động nguy hiểm như xóa, hủy bỏ không thể hoàn tác
 */
const DangerButton: React.FC<DangerButtonProps> = ({
  testId = 'danger-button',
  children,
  className = '',
  variant = 'primary',
  ...props
}) => {
  return (
    <Button
      type={variant}
      danger
      data-testid={testId}
      className={`danger-button ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default DangerButton;