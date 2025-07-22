import React, { useState, useEffect } from 'react';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { Key } from 'react';
import { FilterDropdownUI } from './components';
import { CreateDropdownFilterOptions, FilterOption, StatusDropdownFilterOptions } from './types';
import { useTableFiltersAndSorterStore } from '../../stores/useTableFiltersAndSorterStore';

interface FilterDropdownWrapperProps extends FilterDropdownProps {
  options: FilterOption[];
  selectAllText: string;
  clearText: string;
  confirmText: string;
  tableId: string;
  columnKey: string;
}

const FilterDropdownWrapper: React.FC<FilterDropdownWrapperProps> = ({
  options,
  selectAllText,
  clearText,
  confirmText,
  tableId,
  columnKey,
  setSelectedKeys,
  confirm,
  clearFilters,
}) => {
  const tableStore = useTableFiltersAndSorterStore();

  const storeFilterValue = tableId && columnKey ? tableStore.getColumnFilterValue(tableId, columnKey) : undefined;

  const [selectedKeys, setLocalSelectedKeys] = useState<string[]>(storeFilterValue || []);

  useEffect(() => {
    setLocalSelectedKeys(storeFilterValue || []);
  }, [storeFilterValue]);

  const handleConfirm = () => {
    setSelectedKeys(selectedKeys);

    if (tableId && columnKey) {
      tableStore.setColumnFilterValue(tableId, columnKey, selectedKeys);
    }

    confirm();
  };

  const handleClear = () => {
    setLocalSelectedKeys([]);

    if (tableId && columnKey) {
      tableStore.clearColumnFilter(tableId, columnKey);
    }

    clearFilters?.();
    confirm();
  };

  return (
    <FilterDropdownUI
      options={options}
      selectedKeys={selectedKeys}
      onSelectKeysChange={setLocalSelectedKeys}
      onConfirm={handleConfirm}
      onClear={handleClear}
      selectAllText={selectAllText}
      clearText={clearText}
      confirmText={confirmText}
    />
  );
};

export const createDropdownFilter = ({
  options,
  selectAllText = 'Chọn tất cả',
  clearText = 'Xóa',
  confirmText = 'Lọc',
  filteredValue = [],
  tableId,
  columnKey,
}: CreateDropdownFilterOptions & { tableId: string; columnKey: string }) => {
  return {
    filterDropdown: (props: FilterDropdownProps) => (
      <FilterDropdownWrapper
        {...props}
        options={options}
        selectAllText={selectAllText}
        clearText={clearText}
        confirmText={confirmText}
        tableId={tableId}
        columnKey={columnKey}
      />
    ),
    onFilter: (value: boolean | Key, record: any) => {
      return true;
    },
    filteredValue,
    _tableId: tableId,
    _columnKey: columnKey,
  };
};

export const createStatusDropdownFilter = (statusOptions: FilterOption[], options: StatusDropdownFilterOptions) => {
  const { filteredValue, tableId, columnKey, options: _, ...restOptions } = options || {};

  return createDropdownFilter({
    options: statusOptions,
    placeholder: 'Chọn trạng thái...',
    selectAllText: 'Tất cả trạng thái',
    clearText: 'Xóa lọc',
    confirmText: 'Áp dụng',
    filteredValue,
    tableId,
    columnKey,
    ...restOptions
  });
};
