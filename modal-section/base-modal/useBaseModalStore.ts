import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModalPosition } from './types';
import { BASE_MODAL_CONFIG } from './constants';

interface BaseModalStore {
  modalPositions: Record<string, ModalPosition | null>;
  showGuidance: boolean;
  setModalPosition: (modalId: string, position: ModalPosition) => void;
  getModalPosition: (modalId: string) => ModalPosition;
  resetModalPosition: (modalId: string) => void;
  setShowGuidance: (show: boolean) => void;
  toggleGuidance: () => void;
}

// Hàm tính toán vị trí giữa màn hình
const getCenterPosition = (width?: number, height?: number): ModalPosition => {
  const modalWidth = width || BASE_MODAL_CONFIG.defaultWidth;
  const modalHeight = height || BASE_MODAL_CONFIG.defaultHeight;
  
  return {
    x: Math.max(0, (window.innerWidth - modalWidth) / 2),
    y: Math.max(0, (window.innerHeight - modalHeight) / 2),
  };
};

export const useBaseModalStore = create<BaseModalStore>()(
  persist(
    (set, get) => ({
      modalPositions: {},
      showGuidance: true, // Mặc định hiển thị hướng dẫn
      
      setModalPosition: (modalId, position) => 
        set((state) => ({
          modalPositions: {
            ...state.modalPositions,
            [modalId]: position,
          },
        })),
      
      getModalPosition: (modalId) => {
        const state = get();
        const savedPosition = state.modalPositions[modalId];
        
        // Nếu có vị trí đã lưu, kiểm tra xem có còn hợp lệ không
        if (savedPosition) {
          const modalWidth = BASE_MODAL_CONFIG.defaultWidth;
          const modalHeight = BASE_MODAL_CONFIG.defaultHeight;
          const maxX = window.innerWidth - modalWidth;
          const maxY = window.innerHeight - modalHeight;
          
          // Kiểm tra vị trí có còn trong viewport không
          if (savedPosition.x >= 0 && savedPosition.x <= maxX && 
              savedPosition.y >= 0 && savedPosition.y <= maxY) {
            return savedPosition;
          }
        }
        
        // Nếu không có vị trí đã lưu hoặc vị trí không hợp lệ, trả về vị trí giữa màn hình
        return getCenterPosition();
      },
      
      resetModalPosition: (modalId) => 
        set((state) => ({
          modalPositions: {
            ...state.modalPositions,
            [modalId]: null,
          },
        })),
      
      setShowGuidance: (show) => set({ showGuidance: show }),
      
      toggleGuidance: () => set((state) => ({ showGuidance: !state.showGuidance })),
    }),
    {
      name: 'base-modal-storage',
      partialize: (state) => ({
        modalPositions: state.modalPositions,
        showGuidance: state.showGuidance,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Lỗi khi khôi phục vị trí modal:', error);
          return;
        }
        if (state) {
          console.log('Đã khôi phục vị trí base modal');
        }
      },
    }
  )
);

// Helper function để lấy vị trí modal
export const getBaseModalPosition = (modalId: string): ModalPosition => {
  const store = useBaseModalStore.getState();
  return store.getModalPosition(modalId);
};