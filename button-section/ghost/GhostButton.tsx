import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface GhostButtonProps extends Omit<ButtonProps, 'type' | 'ghost'> {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Button text content
   */
  children: React.ReactNode;
  /**
   * Button type for ghost variant
   */
  buttonType?: 'primary' | 'default';
}

/**
 * Ghost Button Component
 * Sử dụng cho giao diện trong suốt, thường dùng trên background có màu
 */
const GhostButton: React.FC<GhostButtonProps> = ({
  testId = 'ghost-button',
  children,
  className = '',
  buttonType = 'primary',
  ...props
}) => {
  return (
    <Button
      type={buttonType}
      ghost
      data-testid={testId}
      className={`ghost-button ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GhostButton;