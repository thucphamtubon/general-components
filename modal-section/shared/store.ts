import { create } from 'zustand'

/**
 * Zustand store to manage modal open/close state by an unique `modalId`.
 */
export interface IModalStoreState {
  /**
   * A record mapping `modalId` to its open state
   */
  modals: Record<string, boolean>

  /**
   * Open a modal by its id
   */
  openModal: (modalId: string) => void

  /**
   * Close a modal by its id
   */
  closeModal: (modalId: string) => void

  /**
   * Toggle modal open state
   */
  toggleModal: (modalId: string) => void

  /**
   * Close all modals – useful when navigating away
   */
  closeAll: () => void
}

export const useModalStore = create<IModalStoreState>()((set) => ({
  modals: {},
  openModal: (modalId: string) =>
    set((state) => ({ modals: { ...state.modals, [modalId]: true } })),
  closeModal: (modalId: string) =>
    set((state) => ({ modals: { ...state.modals, [modalId]: false } })),
  toggleModal: (modalId: string) =>
    set((state) => ({ modals: { ...state.modals, [modalId]: !state.modals[modalId] } })),
  closeAll: () => set({ modals: {} })
}))

export default useModalStore; 