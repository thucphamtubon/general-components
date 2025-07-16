import { ActionType } from './types';

/**
 * Generate test ID cho button
 * @param baseTestId - Base test ID
 * @param actionType - Action type (optional)
 * @param formName - Form name (optional)
 * @returns Generated test ID
 */
export const generateTestId = (
  baseTestId?: string,
  actionType?: ActionType,
  formName?: string
): string => {
  if (baseTestId) {
    return baseTestId;
  }

  let testId = 'button';
  
  if (actionType && actionType !== 'custom') {
    testId = `${actionType}-button`;
  }
  
  if (formName) {
    testId = `${testId}-${formName}`;
  }
  
  return testId;
};

/**
 * Generate className cho button
 * @param baseClassName - Base class name
 * @param actionType - Action type (optional)
 * @param customClassName - Custom class name (optional)
 * @returns Generated class name
 */
export const generateClassName = (
  baseClassName: string,
  actionType?: ActionType,
  customClassName?: string
): string => {
  let className = baseClassName;
  
  if (actionType && actionType !== 'custom') {
    className = `${className} ${baseClassName}-${actionType}`;
  }
  
  if (customClassName) {
    className = `${className} ${customClassName}`;
  }
  
  return className.trim();
};

/**
 * Xử lý confirmation trước khi thực hiện action
 * @param confirmAction - Có cần confirmation không
 * @param confirmMessage - Message để confirm
 * @param callback - Callback function để thực hiện
 * @returns Function handler
 */
export const handleConfirmation = (
  confirmAction: boolean,
  confirmMessage: string,
  callback?: (e: React.MouseEvent<HTMLElement>) => void
) => {
  return (e: React.MouseEvent<HTMLElement>) => {
    if (confirmAction) {
      if (window.confirm(confirmMessage)) {
        callback?.(e);
      }
    } else {
      callback?.(e);
    }
  };
};

/**
 * Default confirmation messages
 */
export const DEFAULT_CONFIRM_MESSAGES = {
  delete: 'Bạn có chắc chắn muốn xóa?',
  cancel: 'Bạn có chắc chắn muốn hủy bỏ?',
  reset: 'Bạn có chắc chắn muốn reset?',
  clear: 'Bạn có chắc chắn muốn xóa tất cả?',
  logout: 'Bạn có chắc chắn muốn đăng xuất?',
  submit: 'Bạn có chắc chắn muốn gửi?',
} as const;

/**
 * Get default confirm message based on action type
 * @param actionType - Action type
 * @returns Default confirm message
 */
export const getDefaultConfirmMessage = (actionType: ActionType): string => {
  switch (actionType) {
    case 'delete':
      return DEFAULT_CONFIRM_MESSAGES.delete;
    default:
      return 'Bạn có chắc chắn muốn thực hiện hành động này?';
  }
};