import React from 'react';
import { Divider } from 'antd';
import GroupButton from './GroupButton';
import PrimaryButton from '../primary/PrimaryButton';
import SecondaryButton from '../secondary/SecondaryButton';
import ActionButton from '../action/ActionButton';
import IconButton from '../icon/IconButton';
import type { GroupButtonProps } from './GroupButton';
import type { ActionType, ButtonSize } from '../types';

export interface ToolbarActionItem {
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
  onClick: () => void;
  /**
   * Button variant
   */
  variant?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  /**
   * Show condition
   */
  show?: boolean;
  /**
   * Disabled condition
   */
  disabled?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Danger action
   */
  danger?: boolean;
}

export interface ToolbarSection {
  /**
   * Section name
   */
  name: string;
  /**
   * Actions in this section
   */
  actions: ToolbarActionItem[];
  /**
   * Section alignment
   */
  align?: 'left' | 'center' | 'right';
}

export interface ToolbarGroupProps extends Omit<GroupButtonProps, 'children' | 'groupType'> {
  /**
   * Test ID for testing purposes
   */
  testId?: string;
  /**
   * Toolbar sections
   */
  sections?: ToolbarSection[];
  /**
   * Simple actions (alternative to sections)
   */
  actions?: ToolbarActionItem[];
  /**
   * Show dividers between sections
   */
  showDividers?: boolean;
  /**
   * Button size
   */
  size?: 'small' | 'middle' | 'large';
  /**
   * Responsive behavior
   */
  responsive?: boolean;
  /**
   * Collapse to dropdown on small screens
   */
  collapseOnMobile?: boolean;
}

/**
 * Toolbar Group Component
 * Chuyên dụng cho các toolbar với nhiều sections và responsive design
 */
const ToolbarGroup: React.FC<ToolbarGroupProps> = ({
  testId = 'toolbar',
  sections,
  actions,
  showDividers = true,
  size = 'middle',
  responsive = true,
  collapseOnMobile = false,
  spacing = 'middle',
  wrap = true,
  ...groupProps
}) => {
  // Use simple actions if sections not provided
  const toolbarSections: ToolbarSection[] = sections || [
    {
      name: 'main',
      actions: actions || [],
      align: 'left'
    }
  ];

  // Filter visible actions in each section
  const visibleSections = toolbarSections.map(section => ({
    ...section,
    actions: section.actions.filter(action => action.show !== false)
  })).filter(section => section.actions.length > 0);

  // Create action button
  const createActionButton = (action: ToolbarActionItem, sectionName: string) => {
    const buttonTestId = `${testId}-${sectionName}-${action.action}`;
    
    // Choose button component based on variant
    if (action.variant === 'primary') {
      return (
        <PrimaryButton
          key={action.action}
          testId={buttonTestId}
          icon={action.icon}
          size={size}
          disabled={action.disabled}
          loading={action.loading}
          onClick={action.onClick}
        >
          {action.text}
        </PrimaryButton>
      );
    }

    if (action.variant === 'default' || !action.variant) {
      return (
        <SecondaryButton
          key={action.action}
          testId={buttonTestId}
          icon={action.icon}
          size={size}
          disabled={action.disabled}
          loading={action.loading}
          onClick={action.onClick}
        >
          {action.text}
        </SecondaryButton>
      );
    }

    return (
      <ActionButton
        key={action.action}
        testId={buttonTestId}
        actionType={action.action}
        variant={action.variant}
        icon={action.icon}
        size={size}
        disabled={action.disabled}
        loading={action.loading}
        danger={action.danger}
        onClick={action.onClick}
      >
        {action.text}
      </ActionButton>
    );
  };

  // Create section elements
  const sectionElements = visibleSections.map((section, sectionIndex) => {
    const sectionButtons = section.actions.map(action => 
      createActionButton(action, section.name)
    );

    const sectionElement = (
      <GroupButton
        key={section.name}
        testId={`${testId}-section-${section.name}`}
        groupType="toolbar"
        spacing={spacing}
        className={`toolbar-section toolbar-section-${section.align || 'left'}`}
      >
        {sectionButtons}
      </GroupButton>
    );

    // Add divider if not last section and showDividers is true
    if (showDividers && sectionIndex < visibleSections.length - 1) {
      return [
        sectionElement,
        <Divider key={`divider-${sectionIndex}`} type="vertical" style={{ height: '100%' }} />
      ];
    }

    return sectionElement;
  }).flat();

  const toolbarClassName = [
    'toolbar-group',
    responsive ? 'toolbar-responsive' : '',
    collapseOnMobile ? 'toolbar-collapse-mobile' : ''
  ].filter(Boolean).join(' ');

  return (
    <GroupButton
      testId={testId}
      groupType="toolbar"
      spacing={spacing}
      wrap={wrap}
      className={toolbarClassName}
      style={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
      {...groupProps}
    >
      {sectionElements}
    </GroupButton>
  );
};

export default ToolbarGroup;