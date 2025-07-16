import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface ActionButtonProps extends ButtonProps {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Button text content
   */
  children: React.ReactNode;
  /**
   * Action type for styling
   */
  actionType?: 'edit' | 'view' | 'delete' | 'add' | 'export' | 'import' | 'refresh' | 'search' | 'filter' | 'custom';
  /**
   * Button variant
   */
  variant?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  /**
   * Icon for the button
   */
  icon?: React.ReactNode;
}

/**
 * Action Button Component
 * Sử dụng cho các hành động cụ thể với styling phù hợp
 */
const ActionButton: React.FC<ActionButtonProps> = ({
  testId,
  children,
  className = '',
  actionType = 'custom',
  variant = 'default',
  icon,
  ...props
}) => {
  // Generate default testId based on actionType if not provided
  const defaultTestId = testId || `action-button-${actionType}`;
  
  // Generate className based on actionType
  const actionClassName = `action-button action-button-${actionType}`;

  return (
    <Button
      type={variant}
      icon={icon}
      data-testid={defaultTestId}
      className={`${actionClassName} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActionButton;