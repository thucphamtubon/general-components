export interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

export interface CreateDropdownFilterOptions {
  options: FilterOption[];
  placeholder?: string;
  selectAllText?: string;
  clearText?: string;
  confirmText?: string;
  filteredValue?: string[]; // Thêm tùy chọn để nhận các giá trị đã lọc từ filter state
}

export interface FilterDropdownUIProps {
  options: FilterOption[];
  selectedKeys: string[];
  onSelectKeysChange: (keys: string[]) => void;
  onConfirm: () => void;
  onClear: () => void;
  selectAllText?: string;
  clearText?: string;
  confirmText?: string;
}

export interface StatusDropdownFilterOptions extends Omit<CreateDropdownFilterOptions, 'filteredValue'> {
  filteredValue: string[];
  tableId: string;
  columnKey: string;
}
