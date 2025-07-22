import { Col, Pagination, Row } from 'antd';
import { TablePaginationConfig } from '../types/table.types';
import { DEFAULT_PAGE_SIZE_OPTIONS, DEFAULT_PAGINATION } from '../constants';

interface TablePaginationProps {
  pagination: TablePaginationConfig;
  loading?: boolean;
  handleTableChange?: (page: number, pageSize?: number) => void;
  className?: string;
}

export const TablePagination = ({ pagination, loading = false, handleTableChange, className = '' }: TablePaginationProps) => {
  if (!pagination) return null;

  const current = pagination.current || DEFAULT_PAGINATION.current;
  const pageSize = pagination.pageSize || DEFAULT_PAGINATION.pageSize;
  const total = pagination.total || 0;

  const showTotal = pagination.showTotal || ((total: number, range: [number, number]) => `Hiển thị ${range[0]}-${range[1]} của ${total} mục`);

  const handleChange = (page: number, pageSize?: number) => {
    if (handleTableChange) {
      handleTableChange(page, pageSize);
    }
  };

  const handleShowSizeChange = (current: number, size: number) => {
    if (handleTableChange) {
      handleTableChange(1, size);
    }
  };

  return (
    <div
      id={`enhanced-table-pagination`}
      className={`table-pagination-container ${className}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '10px 24px',
        backgroundColor: '#fff',
        borderTop: '1px solid #f0f0f0',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
        zIndex: 1000,
      }}
    >
      <Row className="table-pagination-row" gutter={[16, 16]} align="middle" justify="space-between">
        <Col />
        <Col>
          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={handleChange}
            onShowSizeChange={handleShowSizeChange}
            disabled={loading}
            showSizeChanger
            showQuickJumper
            showTotal={showTotal}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTIONS}
            data-testid="table-pagination"
            size="small"
          />
        </Col>
      </Row>
    </div>
  );
};

export default TablePagination;
