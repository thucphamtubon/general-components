import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface LinkButtonProps extends Omit<ButtonProps, 'type'> {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Button text content
   */
  children: React.ReactNode;
  /**
   * URL to navigate to (optional)
   */
  href?: string;
  /**
   * Target for link (optional)
   */
  target?: string;
}

/**
 * Link Button Component
 * Sử dụng cho các liên kết hoặc hành động không quan trọng
 */
const LinkButton: React.FC<LinkButtonProps> = ({
  testId = 'link-button',
  children,
  className = '',
  href,
  target,
  ...props
}) => {
  return (
    <Button
      type="link"
      data-testid={testId}
      className={`link-button ${className}`}
      href={href}
      target={target}
      {...props}
    >
      {children}
    </Button>
  );
};

export default LinkButton;