import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface SecondaryButtonProps extends Omit<ButtonProps, 'type'> {
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
 * Secondary Button Component
 * Sử dụng cho các hành động phụ, không quan trọng bằng primary button
 */
const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  testId = 'secondary-button',
  children,
  className = '',
  ...props
}) => {
  return (
    <Button
      type="default"
      data-testid={testId}
      className={`secondary-button ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SecondaryButton;