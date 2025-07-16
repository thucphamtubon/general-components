import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface LoadingButtonProps extends ButtonProps {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Button text content
   */
  children: React.ReactNode;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Text to show when loading
   */
  loadingText?: string;
  /**
   * Button type
   */
  buttonType?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
}

/**
 * Loading Button Component
 * Sử dụng cho các button cần hiển thị trạng thái loading khi xử lý
 */
const LoadingButton: React.FC<LoadingButtonProps> = ({
  testId = 'loading-button',
  children,
  className = '',
  loading = false,
  loadingText,
  buttonType = 'primary',
  ...props
}) => {
  return (
    <Button
      type={buttonType}
      loading={loading}
      data-testid={testId}
      className={`loading-button ${className}`}
      {...props}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;