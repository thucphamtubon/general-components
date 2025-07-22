import { useCallback, useMemo } from 'react';
import { DEFAULT_PAGINATION, PDF_CONSTANTS } from '../constants';
import { useTableHeight } from '../hooks/useTableHeight';
import { useTableOrchestrator } from '../hooks/useTableOrchestrator';
import { EnhancedTableProps, TableRecord } from '../types/table.types';
import { exportToExcel } from '../utils/excel.utils';
import { exportToPdf } from '../utils/pdf.utils';
import { applyColumnFilters, compareValues } from '../utils/table.utils';
import { BaseTable } from './BaseTable';
import { TablePagination } from './TablePagination';
import { TableSearchBar } from './TableSearchBar';

export const EnhancedTable = <RecordType extends TableRecord = TableRecord>({
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  bordered = true,
  size = 'middle',
  tableId,
  pagination = true,
  rowSelection = false,
  defaultSelectedRowKeys = [],
  onSelectionChange,
  searchTerm: externalSearchTerm,
  onSearch,
  showTableSearchBar = true,
  onSortChange,
  onFilterChange,
  scroll,
  tableTitle,
  enableExcelDownload = true,
  enablePdfDownload = true,
  ...restProps
}: EnhancedTableProps<RecordType>) => {
  const {
    filters,
    paginationConfig,
    searchTerm,
    searchMode,
    visibleColumnKeys,
    visibleColumns,
    rowSelectionConfig,
    handleTableChange,
    handleSearchChange,
    handleClearSearch,
    handleClearAll,
    handleColumnsVisibilityChange,
  } = useTableOrchestrator(tableId, {
    defaultSelectedRowKeys,
    defaultSearchTerm: externalSearchTerm || '',
    defaultVisibleColumnKeys: columns.map((col) => (col.key || col.dataIndex) as string).filter(Boolean),
    searchOptions: tableId ? { tableId } : undefined,
    onSelectionChange,
    onFilterChange,
    onSortChange,
    onSearch,
    externalSearchTerm,
    dataSource,
    rowKey,
    rowSelection,
    columns,
  });

  const filteredDataSource = useMemo(() => {
    let filtered = dataSource;
    if (searchTerm) {
      filtered = filtered.filter(item => Object.values(item).some(val => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') return false;
        return compareValues(String(val), searchTerm, searchMode);
      }));
    }
    filtered = applyColumnFilters(filtered, filters, columns);
    return filtered;
  }, [dataSource, searchTerm, searchMode, filters, columns]);

  const handleDownloadExcel = useCallback(async () => {
    try {
      await exportToExcel(columns, dataSource, visibleColumnKeys, { fileName: tableTitle || 'Table_Data' });
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error);
    }
  }, [columns, dataSource, visibleColumnKeys, tableTitle]);

  const handleDownloadPdf = useCallback(async () => {
    exportToPdf(columns, dataSource, {
      fileName: tableTitle || 'Table_Data',
      title: tableTitle || 'Dữ liệu bảng',
      orientation: PDF_CONSTANTS.ORIENTATION.LANDSCAPE,
      pageSize: PDF_CONSTANTS.PAGE_SIZE.A4,
      addTitle: true,
      addTimestamp: true,
      addPageNumbers: true
    });
  }, [columns, dataSource, tableTitle]);

  const paginatedDataSource = useMemo(() => {
    if (!pagination || !paginationConfig) return filteredDataSource;
    const { current = DEFAULT_PAGINATION.current, pageSize = DEFAULT_PAGINATION.pageSize } = paginationConfig;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return filteredDataSource.slice(start, end);
  }, [filteredDataSource, pagination, paginationConfig]);

  const { tableHeight, tableHeaderRef } = useTableHeight({});

  return (
    <div>
      {showTableSearchBar && (
        <div ref={tableHeaderRef} style={{ marginBottom: 7 }}>
          <TableSearchBar
            searchText={searchTerm}
            searchMode={searchMode}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            onClearAll={handleClearAll}
            placeholder="Tìm kiếm..."
            data-testid="enhanced-table-search"
            tableId={tableId}
            columns={columns}
            onColumnsVisibilityChange={handleColumnsVisibilityChange}
            onDownloadExcel={enableExcelDownload ? handleDownloadExcel : undefined}
            onDownloadPdf={enablePdfDownload ? handleDownloadPdf : undefined}
            tableTitle={tableTitle || 'Bảng dữ liệu'}
            visibleColumnKeys={visibleColumnKeys}
          />
        </div>
      )}
      <BaseTable<RecordType>
        columns={visibleColumns}
        dataSource={paginatedDataSource}
        loading={loading}
        rowKey={rowKey}
        bordered={bordered}
        size={size}
        pagination={false}
        rowSelection={rowSelectionConfig}
        onChange={handleTableChange}
        scroll={{ y: tableHeight, ...scroll }}
        data-testid="enhanced-table"
        {...restProps}
      />
      {pagination !== false && (
        <TablePagination
          pagination={{
            ...paginationConfig,
            total: filteredDataSource.length
          }}
          loading={loading}
          handleTableChange={(page, pageSize) => {
            if (handleTableChange) {
              const newPagination = {
                ...paginationConfig,
                current: page,
                pageSize: pageSize || paginationConfig.pageSize,
                total: filteredDataSource.length
              };
              handleTableChange(newPagination, {}, {});
            }
          }}
          className="enhanced-table-pagination"
        />
      )}
    </div>
  );
};

export default EnhancedTable;
