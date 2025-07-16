import { useState, useCallback, useMemo } from 'react';
import { TableRowSelection } from 'antd/es/table/interface';

export interface UseTableSelectionReturn {
  selectedRowKeys: React.Key[];
  selectedRows: any[];
  setSelected: (keys: React.Key[], rows: any[]) => void;
  clearSelection: () => void;
  selectAll: (data: any[], rowKey: string) => void;
  isAllSelected: (data: any[]) => boolean;
  isIndeterminate: (data: any[]) => boolean;
  getRowSelection: (rowKey: string) => TableRowSelection<any>;
  hasSelection: boolean;
}

export interface UseTableSelectionOptions {
  enabled?: boolean;
  onSelectionChange?: (keys: React.Key[], rows: any[]) => void;
  onSelectAll?: (selected: boolean, selectedRows: any[], changeRows: any[]) => void;
  getCheckboxProps?: (record: any) => any;
}

export function useTableSelection(
  options: UseTableSelectionOptions = {}
): UseTableSelectionReturn {
  const { 
    enabled = true, 
    onSelectionChange,
    onSelectAll,
    getCheckboxProps 
  } = options;

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const setSelected = useCallback((keys: React.Key[], rows: any[]) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
    onSelectionChange?.(keys, rows);
  }, [onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    onSelectionChange?.([], []);
  }, [onSelectionChange]);

  const selectAll = useCallback((data: any[], rowKey: string) => {
    if (isAllSelected(data)) {
      clearSelection();
    } else {
      const keys = data.map(item => item[rowKey]);
      setSelected(keys, data);
    }
  }, [clearSelection, setSelected]);

  const isAllSelected = useCallback((data: any[]) => {
    return data.length > 0 && selectedRowKeys.length === data.length;
  }, [selectedRowKeys]);

  const isIndeterminate = useCallback((data: any[]) => {
    return selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;
  }, [selectedRowKeys]);

  const getRowSelection = useCallback((rowKey: string): TableRowSelection<any> => {
    if (!enabled) return undefined as any;

    return {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (keys: React.Key[], rows: any[]) => {
        setSelected(keys, rows);
      },
      onSelectAll: (selected: boolean, selectedRows: any[], changeRows: any[]) => {
        onSelectAll?.(selected, selectedRows, changeRows);
      },
      getCheckboxProps: getCheckboxProps || ((record: any) => ({
        disabled: record.disabled || false,
      })),
    };
  }, [enabled, selectedRowKeys, setSelected, onSelectAll, getCheckboxProps]);

  const hasSelection = useMemo(() => {
    return selectedRowKeys.length > 0;
  }, [selectedRowKeys]);

  return {
    selectedRowKeys,
    selectedRows,
    setSelected,
    clearSelection,
    selectAll,
    isAllSelected,
    isIndeterminate,
    getRowSelection,
    hasSelection,
  };
} 