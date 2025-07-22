import { Key, useCallback, useMemo, useState } from 'react';
import { UseTableSelectionReturn } from '../types';

export interface TableSelectionOptions {
  rowSelection?: boolean;
  dataSource?: any[];
  rowKey?: string;
  onSelectionChange?: (selectedRowKeys: Key[], selectedRows: any[]) => void;
}

/**
 * Hook quản lý chức năng chọn hàng của bảng
 * Tuân thủ nguyên tắc SRP bằng cách tách riêng logic chọn hàng
 */
export const useTableSelection = (
  defaultSelectedRowKeys: Key[] = [],
  options: TableSelectionOptions = {},
): UseTableSelectionReturn & {
  rowSelectionConfig: any;
} => {
  const {
    rowSelection = false,
    dataSource = [],
    rowKey = 'id',
    onSelectionChange,
  } = options;

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>(defaultSelectedRowKeys);

  const handleSelectionChange = useCallback((keys: Key[], rows?: any[]) => {
    setSelectedRowKeys(keys);
    
    if (onSelectionChange) {
      const selectedRows = rows || dataSource.filter(item => {
        const itemKey = typeof item === 'object' ? item[rowKey] : item;
        return selectedRowKeys.includes(itemKey);
      });
      onSelectionChange(keys, selectedRows);
    }
  }, [dataSource, rowKey, onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  // Cấu hình rowSelection cho bảng
  const rowSelectionConfig = useMemo(() => {
    if (!rowSelection) {
      return undefined;
    }
    
    return {
      selectedRowKeys,
      onChange: handleSelectionChange,
      preserveSelectedRowKeys: true,
    };
  }, [rowSelection, selectedRowKeys, handleSelectionChange]);

  return {
    selectedRowKeys,
    setSelectedRowKeys,
    handleSelectionChange,
    clearSelection,
    rowSelectionConfig,
  };
};
