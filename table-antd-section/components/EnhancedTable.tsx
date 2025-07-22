import { useCallback, useMemo } from 'react';
import { DEFAULT_PAGINATION, PDF_CONSTANTS } from '../constants';
import { useTableFiltersAndSorter } from '../hooks/useTableFiltersAndSorter';
import { useTableHeight } from '../hooks/useTableHeight';
import { useTablePagination } from '../hooks/useTablePagination';
import { ExtendedTableSearchOptions, useTableSearch } from '../hooks/useTableSearch';
import { useTableSelection } from '../hooks/useTableSelection';
import { EnhancedTableProps, SearchMode, TableRecord } from '../types';
import { compareValues } from '../utils/common-utils';
import { exportToExcel } from '../utils/excel.utils';
import { exportToPdf } from '../utils/pdf.utils';
import { applyColumnFilters } from '../utils/table-utils';
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
  // Sử dụng các hook riêng biệt thay vì useTableOrchestrator
  const defaultVisibleColumnKeys = columns.map((col) => (col.key || col.dataIndex) as string).filter(Boolean);

  // Filters and sorter handling
  const {
    filters,
    sorter,
    handleTableChange,
    clearAll: clearFiltersAndSorter,
  } = useTableFiltersAndSorter(
    { tableId, filters: {}, sorter: {} },
    {
      saveUserPreferences: true,
      onFilterChange,
      onSortChange,
    }
  );

  // Pagination handling
  const {
    paginationConfig,
    handlePaginationChange,
    resetPaginationConfig
  } = useTablePagination(tableId);

  // Search handling
  const searchOptions: ExtendedTableSearchOptions = {
    tableId,
    onSearch,
    externalSearchTerm,
  };

  const {
    searchTerm,
    searchMode,
    visibleColumnKeys,
    setVisibleColumnKeys,
    handleSearch,
    handleSearchChange,
    handleClearSearch,
    clearSearch,
  } = useTableSearch(
    {
      searchTerm: externalSearchTerm || '',
      searchMode: SearchMode.AccentInsensitive,
      visibleColumnKeys: defaultVisibleColumnKeys
    },
    searchOptions,
    defaultVisibleColumnKeys
  );

  // Row selection handling
  const {
    clearSelection,
    rowSelectionConfig
  } = useTableSelection(
    defaultSelectedRowKeys,
    {
      rowSelection,
      dataSource,
      rowKey,
      onSelectionChange
    }
  );

  // Tạo hàm handleClearAll tương tự như trong useTableOrchestrator
  const handleClearAll = useCallback(() => {
    clearFiltersAndSorter();
    resetPaginationConfig();
    clearSearch();
    clearSelection();
  }, [clearFiltersAndSorter, resetPaginationConfig, clearSearch, clearSelection]);

  // Xử lý visibleColumns
  const visibleColumns = useMemo(() => {
    if (!visibleColumnKeys.length || !columns.length) return columns;

    return columns.filter((col) => {
      const columnKey = (col.key || col.dataIndex) as string;
      return visibleColumnKeys.includes(columnKey);
    });
  }, [columns, visibleColumnKeys]);

  // Xử lý thay đổi hiển thị cột
  const handleColumnsVisibilityChange = useCallback((newVisibleColumns: string[]) => {
    setVisibleColumnKeys(newVisibleColumns);
  }, [setVisibleColumnKeys]);

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
            handlePaginationChange(page, pageSize);
          }}
          className="enhanced-table-pagination"
        />
      )}
    </div>
  );
};

export default EnhancedTable;
