import { Key, useCallback, useState } from 'react';
import { UseTableSelectionReturn } from '../types/table.types';

/**
 * Hook quản lý chức năng chọn hàng của bảng
 * Tuân thủ nguyên tắc SRP bằng cách tách riêng logic chọn hàng
 */
export const useTableSelection = (
  defaultSelectedRowKeys: Key[] = [],
): UseTableSelectionReturn => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>(defaultSelectedRowKeys);

  const handleSelectionChange = useCallback((keys: Key[]) => {
    setSelectedRowKeys(keys);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  return {
    selectedRowKeys,
    setSelectedRowKeys,
    handleSelectionChange,
    clearSelection,
  };
};
