import { ButtonProps } from 'antd';

/**
 * Base interface cho tất cả button components
 */
export interface BaseButtonProps extends ButtonProps {
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
 * Action types cho ActionButton
 */
export type ActionType = 
  | 'edit' 
  | 'view' 
  | 'delete' 
  | 'add' 
  | 'export' 
  | 'import' 
  | 'refresh' 
  | 'search' 
  | 'filter' 
  | 'custom';

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'default' | 'dashed' | 'link' | 'text';

/**
 * Button sizes
 */
export type ButtonSize = 'large' | 'middle' | 'small';

/**
 * Button shapes
 */
export type ButtonShape = 'default' | 'circle' | 'round';

/**
 * Common props cho các button có loading state
 */
export interface LoadingStateProps {
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Text to show when loading
   */
  loadingText?: string;
}

/**
 * Common props cho các button có confirmation
 */
export interface ConfirmationProps {
  /**
   * Confirmation before action
   */
  confirmAction?: boolean;
  /**
   * Confirmation message
   */
  confirmMessage?: string;
}

/**
 * Props cho form-related buttons
 */
export interface FormButtonProps {
  /**
   * Form name for identification
   */
  formName?: string;
}