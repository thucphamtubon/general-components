import React from 'react';
import { EnhancedTable } from './index';

// Test data
const testData = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', age: 25 },
  { id: 2, name: 'Trần Thị B', email: 'b@example.com', age: 30 },
  { id: 3, name: 'Lê Văn C', email: 'c@example.com', age: 35 },
];

const testColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Tên', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Tuổi', dataIndex: 'age', key: 'age' },
];

export const TestSearchStore: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Test Table Search Store</h2>
      <p>Bảng này sử dụng store để quản lý trạng thái tìm kiếm với tableId="test-table"</p>

      <EnhancedTable
        tableId="test-table"
        columns={testColumns}
        dataSource={testData}
        tableTitle="Bảng Test Search Store"
        showTableSearchBar={true}
      />

      <div style={{ marginTop: 20 }}>
        <h3>Hướng dẫn test:</h3>
        <ul>
          <li>Thử tìm kiếm với các từ khóa khác nhau</li>
          <li>Mở tùy chọn bảng (icon cài đặt) để thay đổi chế độ tìm kiếm</li>
          <li>Refresh trang để kiểm tra xem chế độ tìm kiếm có được lưu không</li>
          <li>Mở DevTools để xem localStorage có lưu searchMode không</li>
        </ul>
      </div>
    </div>
  );
};

export default TestSearchStore;