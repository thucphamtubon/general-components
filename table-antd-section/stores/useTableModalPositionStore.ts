import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ModalPosition {
  x: number;
  y: number;
}

interface TableModalPositionStore {
  modalPosition: ModalPosition | null;
  showGuidance: boolean;
  setModalPosition: (position: ModalPosition) => void;
  getModalPosition: () => ModalPosition;
  resetModalPosition: () => void;
  setShowGuidance: (show: boolean) => void;
  toggleGuidance: () => void;
}

// Hàm tính toán vị trí giữa màn hình
const getCenterPosition = (): ModalPosition => {
  const modalWidth = 600; // Width của modal từ MODAL_CONFIG
  const modalHeight = 400; // Height ước tính của modal
  
  return {
    x: Math.max(0, (window.innerWidth - modalWidth) / 2),
    y: Math.max(0, (window.innerHeight - modalHeight) / 2),
  };
};

export const useTableModalPositionStore = create<TableModalPositionStore>()(
  persist(
    (set, get) => ({
      modalPosition: null,
      showGuidance: true, // Mặc định hiển thị hướng dẫn
      
      setModalPosition: (position) => set({ modalPosition: position }),
      
      getModalPosition: () => {
        const state = get();
        const savedPosition = state.modalPosition;
        
        // Nếu có vị trí đã lưu, kiểm tra xem có còn hợp lệ không
        if (savedPosition) {
          const modalWidth = 600;
          const modalHeight = 400;
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
      
      resetModalPosition: () => set({ modalPosition: null }),
      
      setShowGuidance: (show) => set({ showGuidance: show }),
      
      toggleGuidance: () => set((state) => ({ showGuidance: !state.showGuidance })),
    }),
    {
      name: 'table-modal-position-storage',
      partialize: (state) => ({
        modalPosition: state.modalPosition,
        showGuidance: state.showGuidance,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Lỗi khi khôi phục vị trí modal:', error);
          return;
        }
        if (state) {
          console.log('Đã khôi phục vị trí modal tùy chọn bảng');
        }
      },
    }
  )
);

// Helper function để lấy vị trí modal
export const getTableModalPosition = (): ModalPosition => {
  const store = useTableModalPositionStore.getState();
  return store.getModalPosition();
};