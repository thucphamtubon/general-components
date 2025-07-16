import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface PrimaryButtonProps extends Omit<ButtonProps, 'type'> {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Button text content
   */
  children: React.ReactNode;
}

/**
 * Primary Button Component
 * Sử dụng cho các hành động chính, quan trọng nhất trong giao diện
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  testId = 'primary-button',
  children,
  className = '',
  ...props
}) => {
  return (
    <Button
      type="primary"
      data-testid={testId}
      className={`primary-button ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;