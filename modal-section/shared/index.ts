// Shared Types
export type {
  IBaseModalProps,
  IContentModalProps,
  IWidthModalProps,
  IValidatableModalProps,
  AlertType,
  ISelectOption,
  IModalComponent,
  IBaseModalConfig
} from './types'

// Shared Hooks
export {
  useModalState,
  useMultiModalState,
  type IUseModalStateOptions,
  type IUseModalStateReturn,
  type IUseMultiModalStateReturn
} from './hooks'

// Shared Utilities
export {
  handleModalError,
  createAsyncHandler,
  getAlertIcon,
  validators,
  validate,
  createModalConfig,
  showInfoModal,
  showConfirmModal,
  showValidationError,
  defaultTexts
} from './utils'

// Modal Store
export { useModalStore } from './store'