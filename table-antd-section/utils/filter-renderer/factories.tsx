import React from 'react';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { Key } from 'react';
import { useFilterState } from './hooks';
import { FilterDropdownUI } from './components';
import { CreateDropdownFilterOptions, FilterOption, StatusDropdownFilterOptions } from './types';

const FilterDropdown: React.FC<FilterDropdownProps & {
  options: FilterOption[];
  selectAllText: string;
  clearText: string;
  confirmText: string;
  initialFilterValue: string[];
  updateFilterValue: (keys: string[]) => void;
  clearFilter: () => void;
}> = ({
  options,
  selectAllText,
  clearText,
  confirmText,
  setSelectedKeys,
  confirm,
  clearFilters,
  initialFilterValue,
  updateFilterValue,
  clearFilter
}) => {
    const [localSelectedKeys, setLocalSelectedKeys] = React.useState<string[]>(initialFilterValue);

    // Update local state when initialFilterValue changes from parent
    React.useEffect(() => {
      setLocalSelectedKeys(initialFilterValue);
    }, [initialFilterValue]);

    const handleConfirm = () => {
      // Only update parent state on confirm
      setSelectedKeys(localSelectedKeys);
      updateFilterValue(localSelectedKeys);
      confirm();
    };

    const handleClear = () => {
      clearFilter();
      clearFilters?.();
    };

    return (
      <FilterDropdownUI
        options={options}
        selectedKeys={localSelectedKeys}
        onSelectKeysChange={setLocalSelectedKeys}
        onConfirm={handleConfirm}
        onClear={handleClear}
        selectAllText={selectAllText}
        clearText={clearText}
        confirmText={confirmText}
      />
    );
  };

interface FilterDropdownWrapperProps extends FilterDropdownProps {
  options: FilterOption[];
  selectAllText: string;
  clearText: string;
  confirmText: string;
  tableId?: string;
  columnKey?: string;
  initialFilterValue?: string[];
}

const FilterDropdownWrapper: React.FC<FilterDropdownWrapperProps> = ({
  options,
  selectAllText,
  clearText,
  confirmText,
  tableId,
  columnKey,
  initialFilterValue = [],
  ...props
}) => {
  const { filterValue, updateFilterValue, clearFilter } = useFilterState(
    tableId,
    columnKey,
    initialFilterValue
  );

  return (
    <FilterDropdown
      {...props}
      options={options}
      selectAllText={selectAllText}
      clearText={clearText}
      confirmText={confirmText}
      initialFilterValue={Array.isArray(filterValue) ? filterValue : []}
      updateFilterValue={updateFilterValue}
      clearFilter={clearFilter}
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
}: CreateDropdownFilterOptions & { tableId?: string; columnKey?: string }) => {
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
        initialFilterValue={filteredValue}
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

export const createStatusDropdownFilter = (statusOptions: FilterOption[], options?: StatusDropdownFilterOptions) => {
  const { filteredValue, tableId, columnKey, ...restOptions } = options || {};

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
