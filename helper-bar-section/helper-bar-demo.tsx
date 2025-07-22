import React, { useState } from 'react';
import { Card, Space, Typography, message } from 'antd';
import { HelperBar, HelperBarMode } from './helper-bar';

const { Title, Text } = Typography;

export const HelperBarDemo: React.FC = () => {
  const [mode, setMode] = useState<HelperBarMode>('filter');
  
  const handleModeChange = (newMode: HelperBarMode) => {
    setMode(newMode);
  };

  // Default handlers for all callbacks
  const defaultHandler = (action: string) => () => {
    console.log(action);
    message.info(action);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [lastAction, setLastAction] = useState<string>('Chưa có hành động nào');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    showMessage(`Đã tìm kiếm: ${value}`);
  };

  const showMessage = (content: string) => {
    setLastAction(content);
    message.info(content);
  };

  const handleAction = (action: string) => {
    showMessage(`Đã thực hiện: ${action}`);
  };

  return (
    <Card 
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>Demo Helper Bar</Title>
          <Text type="secondary">(Chế độ: {mode})</Text>
        </Space>
      }
      style={{ marginBottom: 24 }}
    >
      <div style={{ marginBottom: 24 }}>
        <HelperBar 
          mode={mode}
          onModeChange={handleModeChange}
          onSearch={handleSearch}
          onFilterClick={defaultHandler('Mở bộ lọc')}
          onSettingsClick={defaultHandler('Mở cài đặt')}
          onRefresh={defaultHandler('Làm mới dữ liệu')}
          onAdd={defaultHandler('Thêm mới')}
          onDownload={defaultHandler('Xuất file')}
          onUpload={defaultHandler('Nhập file')}
          onDelete={defaultHandler('Xóa')}
          searchPlaceholder="Nhập từ khóa tìm kiếm..."
        />
      </div>

      <Card type="inner" title="Thông tin trạng thái" size="small">
        <Space direction="vertical">
          <Text>Chế độ hiện tại: <Text strong>{mode}</Text></Text>
          {mode === 'search' && searchQuery && (
            <Text>Đang tìm kiếm: <Text strong>{searchQuery}</Text></Text>
          )}
          <Text>Hành động gần nhất: <Text strong>{lastAction}</Text></Text>
        </Space>
      </Card>

      <div style={{ marginTop: 24 }}>
        <Text type="secondary">
          Thử chuyển đổi giữa các chế độ bằng cách nhấn vào các nút tương ứng trên thanh công cụ.
        </Text>
      </div>
    </Card>
  );
};

export default HelperBarDemo;
