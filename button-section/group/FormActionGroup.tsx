import React from 'react';
import GroupButton, { GroupButtonProps } from './GroupButton';
import SubmitButton from '../submit/SubmitButton';
import CancelButton from '../cancel/CancelButton';
import type { SpaceProps } from 'antd';
import type { SubmitButtonProps } from '../submit/SubmitButton';
import type { CancelButtonProps } from '../cancel/CancelButton';

export interface FormActionGroupProps extends Omit<GroupButtonProps, 'children' | 'groupType'> {
  /** Test ID for the form action group */
  testId?: string;
  /** Form name for generating test IDs */
  formName?: string;
  /** Submit button props */
  submitProps?: Partial<SubmitButtonProps>;
  /** Cancel button props */
  cancelProps?: Partial<CancelButtonProps>;
  /** Whether to show cancel button */
  showCancel?: boolean;
  /** Button order */
  buttonOrder?: 'submit-cancel' | 'cancel-submit';
  /** Extra buttons to display */
  extraButtons?: React.ReactNode[];
  /** Position of extra buttons */
  extraButtonsPosition?: 'start' | 'end' | 'between';
}

/**
 * Form Action Group Component
 * Chuyên dụng cho các form actions như Submit/Cancel với layout chuẩn
 */
const FormActionGroup: React.FC<FormActionGroupProps> = ({
  testId,
  formName,
  submitProps = {},
  cancelProps = {},
  showCancel = true,
  buttonOrder = 'cancel-submit',
  extraButtons,
  extraButtonsPosition = 'start',
  direction = 'horizontal',
  spacing = 'middle',
  justify = 'end',
  ...groupProps
}) => {
  const defaultTestId = testId || (formName ? `form-actions-${formName}` : 'form-actions');
  
  const {
    children: submitText = 'Lưu',
    submitting = false,
    submittingText = 'Đang lưu...',
    onClick: onSubmit,
    disabled: submitDisabled = false,
  } = submitProps;

  const {
    children: cancelText = 'Hủy bỏ',
    variant: cancelVariant = 'default',
    confirmCancel = false,
    confirmMessage = 'Bạn có chắc chắn muốn hủy bỏ?',
    onClick: onCancel,
    disabled: cancelDisabled = false,
  } = cancelProps;

  // Create submit button
  const submitButton = (
    <SubmitButton
      key="submit"
      testId={formName ? `submit-button-${formName}` : 'submit-button'}
      submitting={submitting}
      submittingText={submittingText}
      formName={formName}
      onClick={onSubmit}
      disabled={submitDisabled}
    >
      {submitText}
    </SubmitButton>
  );

  // Create cancel button
  const cancelButton = showCancel ? (
    <CancelButton
      key="cancel"
      testId={formName ? `cancel-button-${formName}` : 'cancel-button'}
      variant={cancelVariant}
      confirmCancel={confirmCancel}
      confirmMessage={confirmMessage}
      formName={formName}
      onClick={onCancel}
      disabled={cancelDisabled}
    >
      {cancelText}
    </CancelButton>
  ) : null;

  // Arrange buttons based on order
  const mainButtons = buttonOrder === 'submit-cancel' 
    ? [submitButton, cancelButton].filter(Boolean)
    : [cancelButton, submitButton].filter(Boolean);

  // Arrange all buttons with extra buttons
  let allButtons: React.ReactNode[] = [];
  
  if (extraButtonsPosition === 'start' && extraButtons) {
    allButtons = [extraButtons, ...mainButtons];
  } else if (extraButtonsPosition === 'end' && extraButtons) {
    allButtons = [...mainButtons, extraButtons];
  } else if (extraButtonsPosition === 'between' && extraButtons && showCancel) {
    const [firstButton, secondButton] = mainButtons;
    allButtons = [firstButton, extraButtons, secondButton].filter(Boolean);
  } else {
    allButtons = mainButtons;
    if (extraButtons) {
      allButtons.push(extraButtons);
    }
  }

  return (
    <GroupButton
      testId={defaultTestId}
      groupType="form-actions"
      direction={direction}
      spacing={spacing}
      justify={justify}
      {...groupProps}
    >
      {allButtons}
    </GroupButton>
  );
};

export default FormActionGroup;