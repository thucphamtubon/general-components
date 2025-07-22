import { useEffect, useMemo } from 'react';
import { Key } from 'react';

/**
 * Interface định nghĩa các tham số đầu vào cho hook useTableRowSelectionConfig
 */
interface UseTableRowSelectionConfigProps {
  rowSelection: boolean;
  selectedRowKeys: Key[];
  handleSelectionChange: (selectedRowKeys: Key[], selectedRows: any[]) => void;
  dataSource: any[];
  rowKey: string;
  onSelectionChange?: (selectedRowKeys: Key[], selectedRows: any[]) => void;
}

/**
 * Hook xử lý cấu hình chọn dòng cho bảng Ant Design
 * Hook này quản lý trạng thái chọn dòng và các tính năng liên quan đến chọn dòng trong bảng
 * Bao gồm việc tạo cấu hình cho bảng và gọi callback khi có thay đổi
 */
export const useTableRowSelectionConfig = ({
  rowSelection,
  selectedRowKeys,
  handleSelectionChange,
  dataSource = [],
  rowKey = 'id',
  onSelectionChange,
}: UseTableRowSelectionConfigProps) => {
  // Gọi callback onSelectionChange khi có thay đổi trong việc chọn dòng
  useEffect(() => {
    if (onSelectionChange && dataSource.length > 0) {
      const selectedRows = dataSource.filter((item: any) => {
        const itemKey = item[rowKey];
        return selectedRowKeys.includes(itemKey);
      });
      onSelectionChange(selectedRowKeys, selectedRows);
    }
  }, [selectedRowKeys, dataSource, rowKey, onSelectionChange]);

  /**
   * Tạo cấu hình chọn dòng cho bảng Ant Design
   * Cấu hình này được sử dụng để thiết lập chức năng chọn dòng trong bảng
   */
  const rowSelectionConfig = useMemo(() => {
    if (!rowSelection) return undefined;

    return {
      selectedRowKeys,
      onChange: handleSelectionChange,
      preserveSelectedRowKeys: true,
    };
  }, [rowSelection, selectedRowKeys, handleSelectionChange]);

  return {
    rowSelectionConfig,
  };
};
