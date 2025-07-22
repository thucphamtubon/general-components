import React from 'react';
import { Button, Checkbox, Space } from 'antd';
import { FilterDropdownUIProps } from './types';

/**
 * Component Filter Dropdown UI
 */
export const FilterDropdownUI = ({
  options,
  selectedKeys,
  onSelectKeysChange,
  onConfirm,
  onClear,
  selectAllText = 'Chọn tất cả',
  clearText = 'Xóa',
  confirmText = 'Lọc'
}: FilterDropdownUIProps) => {
  const handleSelectAll = () => {
    onSelectKeysChange(options.map(option => option.value));
  };

  const handleClear = () => {
    onClear();
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onSelectKeysChange([...selectedKeys, value]);
    } else {
      onSelectKeysChange(selectedKeys.filter(key => key !== value));
    }
  };

  return (
    <div style={{ padding: 8, minWidth: 200 }}>
      <div style={{ marginBottom: 8 }}>
        <Checkbox
          indeterminate={selectedKeys.length > 0 && selectedKeys.length < options.length}
          checked={selectedKeys.length === options.length}
          onChange={(e) => {
            if (e.target.checked) {
              handleSelectAll();
            } else {
              onSelectKeysChange([]);
            }
          }}
        >{selectAllText}</Checkbox>
      </div>

      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
        {options.map(option => (
          <div key={option.value} style={{ marginBottom: 4 }}>
            <Checkbox
              checked={selectedKeys.includes(option.value)}
              onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
            >{option.label}</Checkbox>
          </div>
        ))}
      </div>

      <Space>
        <Button 
          type="primary" 
          size="small" 
          onClick={onConfirm} 
          disabled={selectedKeys.length === 0}
        >{confirmText}</Button>
        <Button 
          size="small" 
          onClick={handleClear}
          disabled={selectedKeys.length === 0}
        >{clearText}</Button>
      </Space>
    </div>
  );
};
