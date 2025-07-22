import { useEffect, useState } from 'react';
import type { ColumnsType, ColumnType } from 'antd/es/table';

export const useColumnVisibility = (
  columns: ColumnsType<any>,
  visibleColumnKeys: string[] = [],
  visible: boolean,
  onColumnsVisibilityChange: (visibleColumns: string[]) => void
) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(visibleColumnKeys);

  useEffect(() => {
    if (visibleColumnKeys.length > 0) {
      setSelectedColumns(visibleColumnKeys);
    } else {
      setSelectedColumns(columns.map((col) => {
        const columnDef = col as ColumnType<any>;
        return (columnDef.key || columnDef.dataIndex) as string;
      }).filter(Boolean));
    }
  }, [columns, visibleColumnKeys, visible]);

  const handleColumnVisibilityChange = (columnKey: string, checked: boolean) => {
    let newSelectedColumns = [...selectedColumns];

    if (checked) {
      if (!newSelectedColumns.includes(columnKey)) {
        newSelectedColumns.push(columnKey);
      }
    } else {
      newSelectedColumns = newSelectedColumns.filter((key) => key !== columnKey);
    }

    setSelectedColumns(newSelectedColumns);
    onColumnsVisibilityChange(newSelectedColumns);
  };

  const handleShowAll = () => {
    const allColumnKeys = columns.map((col) => {
      const columnDef = col as ColumnType<any>;
      return (columnDef.key || columnDef.dataIndex) as string;
    }).filter(Boolean);
    setSelectedColumns(allColumnKeys);
    onColumnsVisibilityChange(allColumnKeys);
  };

  const handleHideAll = () => {
    // Chỉ giữ lại cột đầu tiên để đảm bảo luôn có ít nhất 1 cột hiển thị
    const firstColumnKey = columns.map((col) => {
      const columnDef = col as ColumnType<any>;
      return (columnDef.key || columnDef.dataIndex) as string;
    }).filter(Boolean)[0];

    if (firstColumnKey) {
      const newSelectedColumns = [firstColumnKey];
      setSelectedColumns(newSelectedColumns);
      onColumnsVisibilityChange(newSelectedColumns);
    }
  };

  return {
    selectedColumns,
    handleColumnVisibilityChange,
    handleShowAll,
    handleHideAll
  };
};