import { Spin, Table } from 'antd';
import type { GetRowKey } from 'antd/lib/table/interface';
import React from 'react';
import { useMemo } from 'react';
import { TableProps, TableRecord } from '../types';

/**
 * BaseTable component - Thành phần BaseTable
 * 
 * EN: This component wraps Ant Design Table with common functionality.
 * VI: Thành phần này bọc bảng Ant Design và bổ sung các chức năng dùng chung.
 * 
 * EN: Follows Single Responsibility Principle by focusing only on table rendering.
 * VI: Tuân thủ Nguyên lý Trách nhiệm Đơn lẻ (SRP), chỉ tập trung vào việc hiển thị bảng.
 */
export const BaseTable = <RecordType extends TableRecord = TableRecord>({
  columns,
  dataSource,
  loading,
  pagination,
  rowSelection,
  onChange,
  rowKey = 'id',
  showHeader = true,
  size = 'middle',
  bordered = true,
  scroll,
  ...restProps
}: TableProps<RecordType>) => {
  // Lọc bỏ các cột bị ẩn dựa trên thuộc tính 'hidden'
  const visibleColumns = useMemo(() => {
    if (!columns) return [];
    return columns.filter(column => !column.hidden);
  }, [columns]);

  // Định cấu hình onRow để thêm data-testid cho mỗi hàng
  const onRowConfig = (record: RecordType, index?: number): React.HTMLAttributes<HTMLElement> => {
    // Xác định key của record
    let recordKey: string | number | bigint = '';
    if (typeof rowKey === 'function') {
      recordKey = (rowKey as GetRowKey<RecordType>)(record, index ?? 0);
    } else {
      recordKey = (record as any)[rowKey];
    }
    
    // Convert to string to handle all key types including bigint
    const recordKeyString = String(recordKey);

    return {
      'data-testid': `table-row-${recordKeyString}`,
      'data-row-index': index ?? 0,
      'data-row-key': recordKeyString,
    } as React.HTMLAttributes<HTMLElement>;
  };

  // Cấu hình custom components để thêm data-testid cho cells
  const components = {
    body: {
      cell: (props: any) => {
        // Thêm data-testid vào cell
        const { children, ...restProps } = props;
        const colIndex = props?.['data-colindex'];
        const rowIndex = props?.['data-rowindex'];
        return (
          <td {...restProps} data-testid={`table-cell-${rowIndex}-${colIndex}`}>
            {children}
          </td>
        );
      }
    }
  };

  return (
    <Spin spinning={!!loading} data-testid="table-loading-spinner">
      <Table<RecordType>
        columns={visibleColumns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination !== false ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
        } : false}
        rowSelection={rowSelection}
        onChange={onChange}
        rowKey={rowKey}
        showHeader={showHeader}
        size={size}
        bordered={bordered}
        scroll={scroll || { x: 'max-content' }}
        data-testid="base-table"
        onRow={onRowConfig}
        components={components}
        {...restProps}
      />
    </Spin>
  );
};

export default BaseTable;
