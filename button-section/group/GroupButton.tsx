import React from 'react';
import { Space, SpaceProps } from 'antd';

export interface GroupButtonProps extends Omit<SpaceProps, 'children'> {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Button elements to group
   */
  children: React.ReactNode;
  /**
   * Layout direction
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * Space between buttons
   */
  spacing?: 'small' | 'middle' | 'large' | number;
  /**
   * Alignment of buttons
   */
  align?: 'start' | 'end' | 'center' | 'baseline';
  /**
   * Justify content
   */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
  /**
   * Wrap buttons when overflow
   */
  wrap?: boolean;
  /**
   * Group type for styling
   */
  groupType?: 'default' | 'form-actions' | 'table-actions' | 'modal-actions' | 'toolbar';
  /**
   * Make all buttons same width
   */
  equalWidth?: boolean;
}

/**
 * Group Button Component
 * Sử dụng để nhóm các button lại với nhau với layout và spacing phù hợp
 */
const GroupButton: React.FC<GroupButtonProps> = ({
  testId = 'group-button',
  children,
  direction = 'horizontal',
  spacing = 'middle',
  align,
  justify,
  wrap = false,
  groupType = 'default',
  equalWidth = false,
  className = '',
  style,
  ...props
}) => {
  // Generate className based on groupType
  const groupClassName = `group-button group-button-${groupType}`;
  
  // Generate styles for equal width
  const groupStyle: React.CSSProperties = {
    ...style,
    ...(equalWidth && direction === 'horizontal' ? {
      display: 'flex',
      width: '100%'
    } : {})
  };

  // Process children for equal width
  const processedChildren = equalWidth && direction === 'horizontal' 
    ? React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            style: {
              flex: 1,
              ...child.props.style
            }
          });
        }
        return child;
      })
    : children;

  return (
    <Space
      data-testid={testId}
      direction={direction}
      size={spacing}
      align={align}
      wrap={wrap}
      className={`${groupClassName} ${className}`}
      style={justify ? { ...groupStyle, justifyContent: justify } : groupStyle}
      {...props}
    >
      {processedChildren}
    </Space>
  );
};

export default GroupButton;