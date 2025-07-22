// Base Modal Components
export { default as BaseModal } from './BaseModal';

// Hooks
export { useDraggableBaseModal } from './useDraggableBaseModal';
export { useBaseModalStore, getBaseModalPosition } from './useBaseModalStore';

// Types
export type {
  BaseModalProps,
  ModalPosition,
  DragState,
  ModalConfig,
  ModalConstraints,
} from './types';

// Constants
export {
  BASE_MODAL_CONFIG,
  BASE_MODAL_CONSTRAINTS,
  BASE_MODAL_STYLES,
  BASE_MODAL_ARIA_LABELS,
  BASE_MODAL_UI_LABELS,
} from './constants';