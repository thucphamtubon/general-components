import { useState, useRef, useEffect, useCallback } from 'react';
import { BASE_MODAL_CONSTRAINTS } from './constants';
import { useBaseModalStore } from './useBaseModalStore';
import type { ModalPosition } from './types';

export const useDraggableBaseModal = (modalId: string = 'default-modal') => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<ModalPosition>({ x: 0, y: 0 });
  
  const modalRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<ModalPosition>({ x: 0, y: 0 });

  // Zustand store actions
  const { setModalPosition, getModalPosition } = useBaseModalStore();
  
  // Lấy vị trí modal từ store (sẽ trả về vị trí giữa màn hình nếu chưa có)
  const modalPosition = getModalPosition(modalId);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    console.log('Mouse down event triggered for modal:', modalId);
    
    // Ngăn chặn drag nếu click vào button hoặc input
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('button')) {
      console.log('Clicked on interactive element, preventing drag');
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    console.log('Starting drag operation for modal:', modalId);
    setIsDragging(true);
    
    // Lưu vị trí bắt đầu drag
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDragOffset({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y
    });

    // Thêm cursor move cho toàn bộ document
    document.body.style.cursor = 'move';
    document.body.style.userSelect = 'none';
  }, [modalPosition, modalId]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    console.log('Mouse move during drag for modal:', modalId);

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Giới hạn vị trí modal trong viewport
    const maxX = window.innerWidth - BASE_MODAL_CONSTRAINTS.defaultWidth;
    const maxY = window.innerHeight - BASE_MODAL_CONSTRAINTS.defaultHeight;

    const constrainedX = Math.max(BASE_MODAL_CONSTRAINTS.minX, Math.min(newX, maxX));
    const constrainedY = Math.max(BASE_MODAL_CONSTRAINTS.minY, Math.min(newY, maxY));

    const newPosition = { x: constrainedX, y: constrainedY };
    
    // Cập nhật vị trí trong store
    setModalPosition(modalId, newPosition);
  }, [isDragging, dragOffset, setModalPosition, modalId]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    console.log('Mouse up - ending drag for modal:', modalId);
    setIsDragging(false);
    
    // Reset cursor
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [isDragging, modalId]);

  // Effect để thêm/xóa event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

  return {
    isDragging,
    modalPosition,
    modalRef,
    handleMouseDown,
  };
};