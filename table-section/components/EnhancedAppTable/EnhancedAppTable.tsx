import { Table } from 'antd';
import { TableProps } from 'antd/es/table';
import React, { useEffect, useMemo } from 'react';
import { useTableOrchestrator } from '../../hooks/useTableOrchestrator';
import { IConstants } from '../../types/Table.types';
import { TableHeader } from '../TableHeader';
import './EnhancedAppTable.less';

export interface EnhancedAppTableProps extends Omit<TableProps<any>, 'dataSource' | 'columns' | 'pagination' | 'rowSelection'> {
  // Required props
  constants: Partial<IConstants>;
  data: any[];

  // Optional configuration
  striped?: boolean;
  stickyHeader?: boolean;
  scrollX?: number | string;
  rowKey?: string;
  initialPageSize?: number;
  enableSearch?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;

  // External selection control
  selectedRowKeys?: React.Key[];

  // Callbacks
  onRefresh?: () => Promise<void>;
  onSelectionChange?: (keys: React.Key[], rows: any[]) => void;
  onPageChange?: (page: number, pageSize: number) => void;

  // UI customization
  emptyText?: string;
  searchPlaceholder?: string;
  showSearchBar?: boolean;
  headerClassName?: string;
  headerStyle?: React.CSSProperties;
}

/**
 * Enhanced AppTable component following Single Responsibility Principle
 * - Chỉ tập trung vào việc orchestrate table và render
 * - Logic được ủy thác cho specialized hooks và components
 * - Dễ test và maintain
 * - Tuân thủ DRY principle
 */
export function EnhancedAppTable(props: EnhancedAppTableProps) {
  const {
    constants,
    data,
    rowKey = 'id',
    initialPageSize = 10,
    enableSearch = true,
    enableSelection = true,
    enablePagination = true,
    striped = false,
    stickyHeader = false,
    scrollX = 'max-content',
    onRefresh,
    onSelectionChange,
    onPageChange,
    emptyText = 'Không có dữ liệu',
    searchPlaceholder = 'Tìm kiếm...',
    showSearchBar = true,
    selectedRowKeys: externalSelectedRowKeys,
    headerClassName,
    headerStyle,
    loading,
    ...tableProps
  } = props;

  // Use orchestrator hook để coordinate tất cả logic
  const table = useTableOrchestrator({
    constants,
    data,
    rowKey,
    initialPageSize,
    enableSearch,
    enableSelection,
    enablePagination,
    onRefresh,
    onSelectionChange,
    onPageChange,
    loading: !!loading,
  });

  // Build rowClassName (stripe support)
  const computedRowClassName = useMemo(() => {
    if (!striped) return undefined;
    return (_: any, index: number) => (index % 2 === 1 ? 'table-row--odd' : '');
  }, [striped]);

  // Merge external selectedRowKeys if provided
  const rowSelection = useMemo(() => {
    const baseRowSelection = table.selection.getRowSelection(rowKey);
    return externalSelectedRowKeys !== undefined
      ? { ...baseRowSelection, selectedRowKeys: externalSelectedRowKeys }
      : baseRowSelection;
  }, [table.selection, rowKey, externalSelectedRowKeys]);

  // Sync internal selection with external keys
  useEffect(() => {
    if (externalSelectedRowKeys !== undefined) {
      const areDifferent =
        externalSelectedRowKeys.length !== table.selection.selectedRowKeys.length ||
        externalSelectedRowKeys.some(key => !table.selection.selectedRowKeys.includes(key));
      if (areDifferent) {
        const selectedRows = data.filter(item => externalSelectedRowKeys.includes(item[rowKey]));
        table.selection.setSelected(externalSelectedRowKeys, selectedRows);
      }
    }
  }, [externalSelectedRowKeys, data, rowKey, table.selection]);

  // Prepare header props
  const headerProps = useMemo(() => ({
    enableSearch: enableSearch && showSearchBar,
    searchProps: enableSearch && showSearchBar ? {
      searchText: table.search.searchText,
      onSearchChange: table.search.setSearchText,
      onClearSearch: table.search.clearSearch,
      placeholder: searchPlaceholder,
    } : undefined,
    enableSelection: enableSelection,
    selectionProps: enableSelection ? {
      selectedCount: table.selection.selectedRowKeys.length,
      onClearSelection: table.selection.clearSelection,
    } : undefined,
    className: headerClassName,
    style: headerStyle,
    liveRegionContent: table.state.loading 
      ? 'Đang tải dữ liệu bảng' 
      : `Hiển thị ${table.displayData.length} trong tổng số ${table.totalCount} mục`,
  }), [
    enableSearch,
    showSearchBar,
    enableSelection,
    table.search.searchText,
    table.search.setSearchText,
    table.search.clearSearch,
    searchPlaceholder,
    table.selection.selectedRowKeys.length,
    table.selection.clearSelection,
    headerClassName,
    headerStyle,
    table.state.loading,
    table.displayData.length,
    table.totalCount,
  ]);

  return (
    <div className="enhanced-app-table">
      {/* Table Header with Search and Selection */}
      <TableHeader {...headerProps} />

      {/* Main Table */}
      <Table
        {...tableProps}
        scroll={{ x: scrollX, ...(tableProps as any).scroll }}
        rowKey={rowKey}
        columns={table.columns}
        dataSource={table.displayData}
        loading={loading || table.state.loading}
        pagination={table.pagination.getPaginationConfig()}
        rowSelection={rowSelection}
        rowClassName={computedRowClassName}
        locale={{
          emptyText: table.isEmpty ? emptyText : undefined,
        }}
        aria-label="Bảng dữ liệu"
        sticky={stickyHeader}
      />
    </div>
  );
}

export default EnhancedAppTable; 