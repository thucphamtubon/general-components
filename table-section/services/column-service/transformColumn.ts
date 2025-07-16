import React from 'react';
import { Checkbox, Button, Space } from 'antd';
import { ITableColumn } from '../../types/Table.types';

/**
 * Các tùy chọn cho các hàm xử lý column
 */
export interface ColumnServiceOptions {
  sortedInfo?: any;
  filteredInfo?: any;
  searchText?: string;
  onSearch?: (value: string) => void;
  onReset?: () => void;
}

/**
 * Chuyển đổi định nghĩa column (ITableColumn) sang định dạng column của Ant Design Table
 */
export function transformColumn(
  column: ITableColumn,
  options: ColumnServiceOptions = {}
): any {
  if (!column || typeof column !== 'object') {
    return null;
  }

  const { sortedInfo, filteredInfo = {} } = options;

  const transformedColumn: any = {
    key: column.id,
    dataIndex: column.id,
    title: column.name,
    width: column.width,
    fixed: column.fixed,
    align: column.align,
  };

  /* ------------ Render ------------ */
  if (column.render) {
    transformedColumn.render = (cell: any, row: any, index: number) => {
      return column.render!(cell, row, index, options);
    };
  }

  /* ------------ Children ------------ */
  if (column.children) {
    transformedColumn.children = column.children
      .map(child => transformColumn(child, options))
      .filter(Boolean);
  }

  /* ------------ Sorting ------------ */
  if (column.sorter) {
    transformedColumn.sorter = column.sorter;
    if (sortedInfo?.column?.id === column.id) {
      transformedColumn.sortOrder = sortedInfo.order;
    }
  }

  /* ------------ Filtering ------------ */
  if (column.filters) {
    transformedColumn.filters = column.filters;
    transformedColumn.onFilter = column.onFilter;

    // Custom filter dropdown to include "Select All" and "Clear" actions
    transformedColumn.filterDropdown = (props: any) => {
      const { setSelectedKeys, selectedKeys, confirm, clearFilters } = props;
      const allKeys = column.filters!.map((f: any) => f.value);

      const onGroupChange = (checkedValues: any[]) =>
        setSelectedKeys(checkedValues as React.Key[]);

      return React.createElement(
        'div',
        { style: { padding: 8 } },
        [
          React.createElement(
            Checkbox.Group,
            {
              key: 'group',
              style: { display: 'flex', flexDirection: 'column', rowGap: 4 },
              value: selectedKeys as any,
              onChange: onGroupChange,
            },
            ...column.filters!.map((f: any) =>
              React.createElement(
                Checkbox,
                { key: f.value, value: f.value, style: { marginBottom: 4 } },
                f.text
              )
            )
          ),
          React.createElement(
            Space,
            { key: 'buttons', style: { marginTop: 8 } },
            React.createElement(
              Button,
              { size: 'small', onClick: () => setSelectedKeys(allKeys) },
              'Chọn hết'
            ),
            React.createElement(
              Button,
              {
                size: 'small',
                onClick: () => {
                  setSelectedKeys([]);
                  clearFilters?.();
                },
              },
              'Xóa'
            ),
            React.createElement(
              Button,
              { type: 'primary', size: 'small', onClick: () => confirm() },
              'OK'
            )
          ),
        ]
      );
    };
  }

  // Set filtered value only when controlled filtering is provided
  if (filteredInfo && Object.prototype.hasOwnProperty.call(filteredInfo, column.id)) {
    transformedColumn.filteredValue = filteredInfo[column.id];
  }

  return transformedColumn;
}
