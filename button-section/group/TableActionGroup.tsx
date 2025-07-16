import React from 'react';
import { Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import GroupButton from './GroupButton';
import ActionButton from '../action/ActionButton';
import IconButton from '../icon/IconButton';
import type { MenuProps } from 'antd';
import type { GroupButtonProps } from './GroupButton';
import { ActionType } from '../types';

export interface TableActionItem {
  /**
   * Action type
   */
  action: ActionType;
  /**
   * Button text
   */
  text: string;
  /**
   * Icon for the action
   */
  icon?: React.ReactNode;
  /**
   * Click handler
   */
  onClick: (record?: any) => void;
  /**
   * Show condition
   */
  show?: boolean | ((record?: any) => boolean);
  /**
   * Disabled condition
   */
  disabled?: boolean | ((record?: any) => boolean);
  /**
   * Danger action
   */
  danger?: boolean;
  /**
   * Confirmation before action
   */
  confirm?: {
    title: string;
    message?: string;
  };
}

export interface TableActionGroupProps extends Omit<GroupButtonProps, 'children' | 'groupType'> {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Record data for the row
   */
  record?: any;
  /**
   * Action items
   */
  actions: TableActionItem[];
  /**
   * Maximum visible actions before showing dropdown
   */
  maxVisibleActions?: number;
  /**
   * Show actions as icons only
   */
  iconOnly?: boolean;
  /**
   * Button size
   */
  size?: 'small' | 'middle' | 'large';
  /**
   * Dropdown trigger
   */
  dropdownTrigger?: ('click' | 'hover')[];
}

/**
 * Table Action Group Component
 * Chuyên dụng cho các hành động trên table row với dropdown cho nhiều actions
 */
const TableActionGroup: React.FC<TableActionGroupProps> = ({
  testId = 'table-actions',
  record,
  actions,
  maxVisibleActions = 3,
  iconOnly = false,
  size = 'small',
  dropdownTrigger = ['click'],
  spacing = 'small',
  ...groupProps
}) => {
  // Filter actions based on show condition
  const visibleActions = actions.filter(action => {
    if (typeof action.show === 'function') {
      return action.show(record);
    }
    return action.show !== false;
  });

  // Check if action is disabled
  const isActionDisabled = (action: TableActionItem): boolean => {
    if (typeof action.disabled === 'function') {
      return action.disabled(record);
    }
    return action.disabled === true;
  };

  // Handle action click with confirmation
  const handleActionClick = (action: TableActionItem) => {
    if (action.confirm) {
      const confirmed = window.confirm(
        action.confirm.message || `${action.confirm.title}\n\nBạn có chắc chắn muốn thực hiện hành động này?`
      );
      if (confirmed) {
        action.onClick(record);
      }
    } else {
      action.onClick(record);
    }
  };

  // Split actions into visible and dropdown
  const directActions = visibleActions.slice(0, maxVisibleActions);
  const dropdownActions = visibleActions.slice(maxVisibleActions);

  // Create direct action buttons
  const directButtons = directActions.map((action, index) => {
    const disabled = isActionDisabled(action);
    const buttonTestId = `${testId}-${action.action}`;

    if (iconOnly && action.icon) {
      return (
        <IconButton
          key={action.action}
          testId={buttonTestId}
          icon={action.icon}
          size={size}
          disabled={disabled}
          danger={action.danger}
          tooltip={action.text}
          onClick={() => handleActionClick(action)}
        />
      );
    }

    return (
      <ActionButton
        key={action.action}
        testId={buttonTestId}
        actionType={action.action}
        variant={action.danger ? 'primary' : 'default'}
        danger={action.danger}
        size={size}
        icon={action.icon}
        disabled={disabled}
        onClick={() => handleActionClick(action)}
      >
        {action.text}
      </ActionButton>
    );
  });

  // Create dropdown menu items
  const dropdownItems: MenuProps['items'] = dropdownActions.map((action, index) => ({
    key: action.action,
    label: action.text,
    icon: action.icon,
    disabled: isActionDisabled(action),
    danger: action.danger,
    onClick: () => handleActionClick(action),
  }));

  // Create dropdown button if there are overflow actions
  const dropdownButton = dropdownActions.length > 0 ? (
    <Dropdown
      menu={{ items: dropdownItems }}
      trigger={dropdownTrigger}
      placement="bottomRight"
    >
      <IconButton
        testId={`${testId}-more`}
        icon={<MoreOutlined />}
        size={size}
        tooltip="Thêm hành động"
      />
    </Dropdown>
  ) : null;

  // Combine all buttons
  const allButtons = [...directButtons];
  if (dropdownButton) {
    allButtons.push(dropdownButton);
  }

  return (
    <GroupButton
      testId={testId}
      groupType="table-actions"
      spacing={spacing}
      {...groupProps}
    >
      {allButtons}
    </GroupButton>
  );
};

export default TableActionGroup;