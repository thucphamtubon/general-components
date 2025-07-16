// Main CRUD Modal Component
export { default as CRUDModal } from './CRUDModal'

// Sub-components (for advanced usage)
export { default as CRUDModalBase } from './CRUDModalBase'
export { default as CRUDModalFooter } from './CRUDModalFooter'
export { default as CRUDModalErrorAlert } from './CRUDModalErrorAlert'

// Custom Hook
export { useCRUDModal } from './useCRUDModal'

// Types
export type {
  CRUDMode,
  ICRUDModalState,
  ICRUDModalPermissions,
  ICRUDModalProps,
  ICRUDModalBaseProps,
  ICRUDModalFooterProps,
  ICRUDModalErrorAlertProps,
  ICRUDModalHookOptions,
  ICRUDModalHookReturn
} from './types' 