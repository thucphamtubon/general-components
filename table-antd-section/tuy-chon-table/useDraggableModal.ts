import { useState, useRef, useEffect, useCallback } from 'react';
import { MODAL_CONSTRAINTS } from './constants';
import { useTableModalPositionStore, ModalPosition } from '../stores/useTableModalPositionStore';

export const useDraggableModal = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<ModalPosition>({ x: 0, y: 0 });

  const modalRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<ModalPosition>({ x: 0, y: 0 });

  // Zustand store actions
  const { setModalPosition, getModalPosition } = useTableModalPositionStore();

  // Lấy vị trí modal từ store (sẽ trả về vị trí giữa màn hình nếu chưa có)
  const modalPosition = getModalPosition();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {

    // Ngăn chặn drag nếu click vào button hoặc input
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('button')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

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
  }, [modalPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Giới hạn vị trí modal trong viewport
    const maxX = window.innerWidth - 600; // 600 là width của modal
    const maxY = window.innerHeight - 400; // 400 là height ước tính của modal

    const constrainedX = Math.max(MODAL_CONSTRAINTS.minX, Math.min(newX, maxX));
    const constrainedY = Math.max(MODAL_CONSTRAINTS.minY, Math.min(newY, maxY));

    const newPosition = { x: constrainedX, y: constrainedY };

    // Cập nhật vị trí trong store
    setModalPosition(newPosition);
  }, [isDragging, dragOffset, setModalPosition]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // Reset cursor
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [isDragging]);

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