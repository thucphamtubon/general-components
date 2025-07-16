import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface IconButtonProps extends ButtonProps {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Icon element
   */
  icon: React.ReactNode;
  /**
   * Button shape
   */
  shape?: 'default' | 'circle' | 'round';
  /**
   * Button size
   */
  size?: 'large' | 'middle' | 'small';
  /**
   * Tooltip text (optional)
   */
  tooltip?: string;
}

/**
 * Icon Button Component
 * Sử dụng cho các button chỉ có icon, thường dùng cho các hành động nhanh
 */
const IconButton: React.FC<IconButtonProps> = ({
  testId = 'icon-button',
  icon,
  className = '',
  shape = 'default',
  size = 'middle',
  tooltip,
  title,
  ...props
}) => {
  return (
    <Button
      icon={icon}
      shape={shape}
      size={size}
      data-testid={testId}
      className={`icon-button ${className}`}
      title={tooltip || title}
      {...props}
    />
  );
};

export default IconButton;