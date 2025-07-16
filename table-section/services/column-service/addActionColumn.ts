import React from 'react';
import { ColumnsType } from 'antd/lib/table/interface';

/**
 * Thêm cột hành động vào cuối bảng
 */
export function addActionColumn(
  columns: ColumnsType<any>,
  actionRenderer: (record: any, index: number) => React.ReactNode
): ColumnsType<any> {
  return [
    ...columns,
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: actionRenderer,
    },
  ];
}
