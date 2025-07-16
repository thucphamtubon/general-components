// Modal Components
export {
  AlertModal,
  ConfirmModal,
  FormModal,
  InputModal,
  MessageModal,
  SelectModal,
  type IAlertModalProps,
  type IConfirmModalProps,
  type IFormModalProps,
  type IInputModalProps,
  type IMessageModalProps,
  type ISelectModalProps,
  type AlertType,
  type ISelectOption
} from './components'

// CRUD Modal Components
export {
  CRUDModal,
  CRUDModalBase,
  CRUDModalFooter,
  CRUDModalErrorAlert,
  useCRUDModal,
  type CRUDMode,
  type ICRUDModalState,
  type ICRUDModalPermissions,
  type ICRUDModalProps,
  type ICRUDModalBaseProps,
  type ICRUDModalFooterProps,
  type ICRUDModalErrorAlertProps,
  type ICRUDModalHookOptions,
  type ICRUDModalHookReturn
} from './components'

// Business Modal Components
export {
  LyDoHuyModal
} from './business'

// Shared Types, Hooks, and Utilities
export {
  type IBaseModalProps,
  type IContentModalProps,
  type IWidthModalProps,
  type IValidatableModalProps,
  type IModalComponent,
  type IBaseModalConfig,
  useModalState,
  useMultiModalState,
  type IUseModalStateOptions,
  type IUseModalStateReturn,
  type IUseMultiModalStateReturn,
  handleModalError,
  createAsyncHandler,
  getAlertIcon,
  validators,
  validate,
  createModalConfig,
  showInfoModal,
  showConfirmModal,
  showValidationError,
  defaultTexts,
  useModalStore
} from './shared'
 