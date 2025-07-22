import React from 'react';
import { Button, Space } from 'antd';
import { EnhancedTable, useTableFiltersAndSorter } from './index';

// Test data
const testData = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', age: 25, status: 'active' },
  { id: 2, name: 'Trần Thị B', email: 'b@example.com', age: 30, status: 'inactive' },
  { id: 3, name: 'Lê Văn C', email: 'c@example.com', age: 35, status: 'active' },
  { id: 4, name: 'Phạm Thị D', email: 'd@example.com', age: 28, status: 'pending' },
  { id: 5, name: 'Hoàng Văn E', email: 'e@example.com', age: 32, status: 'active' },
];

const testColumns = [
  { 
    title: 'ID', 
    dataIndex: 'id', 
    key: 'id',
    sorter: (a: any, b: any) => a.id - b.id,
  },
  { 
    title: 'Tên', 
    dataIndex: 'name', 
    key: 'name',
    sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    filters: [
      { text: 'Nguyễn', value: 'Nguyễn' },
      { text: 'Trần', value: 'Trần' },
      { text: 'Lê', value: 'Lê' },
      { text: 'Phạm', value: 'Phạm' },
      { text: 'Hoàng', value: 'Hoàng' },
    ],
    onFilter: (value: any, record: any) => record.name.includes(value),
  },
  { 
    title: 'Email', 
    dataIndex: 'email', 
    key: 'email',
    sorter: (a: any, b: any) => a.email.localeCompare(b.email),
  },
  { 
    title: 'Tuổi', 
    dataIndex: 'age', 
    key: 'age',
    sorter: (a: any, b: any) => a.age - b.age,
    filters: [
      { text: '20-25', value: '20-25' },
      { text: '26-30', value: '26-30' },
      { text: '31-35', value: '31-35' },
    ],
    onFilter: (value: any, record: any) => {
      if (value === '20-25') return record.age >= 20 && record.age <= 25;
      if (value === '26-30') return record.age >= 26 && record.age <= 30;
      if (value === '31-35') return record.age >= 31 && record.age <= 35;
      return false;
    },
  },
  { 
    title: 'Trạng thái', 
    dataIndex: 'status', 
    key: 'status',
    filters: [
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' },
      { text: 'Pending', value: 'pending' },
    ],
    onFilter: (value: any, record: any) => record.status === value,
  },
];

const TestFiltersAndSorterControls: React.FC = () => {
  const {
    filters,
    sorter,
    setFilters,
    setSorter,
    clearFilters,
    clearSorter,
    clearAll,
    resetToDefault,
  } = useTableFiltersAndSorter(
    { filters: {}, sorter: {} },
    { tableId: 'test-filters-sorter-table', saveUserPreferences: true }
  );

  return (
    <div style={{ marginBottom: 16 }}>
      <h4>Điều khiển Filters & Sorter:</h4>
      <Space wrap>
        <Button onClick={() => setFilters({ name: ['Nguyễn'] })}>
          Filter theo "Nguyễn"
        </Button>
        <Button onClick={() => setFilters({ age: ['26-30'] })}>
          Filter theo tuổi 26-30
        </Button>
        <Button onClick={() => setSorter({ columnKey: 'age', order: 'ascend' })}>
          Sắp xếp tuổi tăng dần
        </Button>
        <Button onClick={() => setSorter({ columnKey: 'name', order: 'descend' })}>
          Sắp xếp tên giảm dần
        </Button>
        <Button onClick={clearFilters}>
          Xóa Filters
        </Button>
        <Button onClick={clearSorter}>
          Xóa Sorter
        </Button>
        <Button onClick={clearAll} type="primary" danger>
          Xóa tất cả
        </Button>
        <Button onClick={resetToDefault}>
          Reset về mặc định
        </Button>
      </Space>
      
      <div style={{ marginTop: 8 }}>
        <p><strong>Current Filters:</strong> {JSON.stringify(filters)}</p>
        <p><strong>Current Sorter:</strong> {JSON.stringify(sorter)}</p>
      </div>
    </div>
  );
};

export const TestFiltersAndSorterStore: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Test Table Filters & Sorter Store</h2>
      <p>Bảng này sử dụng store để quản lý trạng thái filters và sorter với tableId="test-filters-sorter-table"</p>
      
      <TestFiltersAndSorterControls />
      
      <EnhancedTable
        tableId="test-filters-sorter-table"
        columns={testColumns}
        dataSource={testData}
        tableTitle="Bảng Test Filters & Sorter Store"
        showTableSearchBar={true}
      />
      
      <div style={{ marginTop: 20 }}>
        <h3>Hướng dẫn test:</h3>
        <ul>
          <li>Sử dụng các nút điều khiển ở trên để thay đổi filters và sorter</li>
          <li>Thử click vào header cột để sắp xếp</li>
          <li>Thử click vào icon filter ở header cột để lọc</li>
          <li>Refresh trang để kiểm tra xem filters và sorter có được lưu không</li>
          <li>Mở DevTools → Application → Local Storage để xem dữ liệu được lưu</li>
          <li>Key lưu trữ: "table-filters-sorter-storage"</li>
        </ul>
      </div>
    </div>
  );
};

export default TestFiltersAndSorterStore;