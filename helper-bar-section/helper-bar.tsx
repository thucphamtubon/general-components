import React, { ReactNode } from 'react';
import { Button, Space, Tooltip } from 'antd';
import { 
  FilterOutlined, 
  SearchOutlined, 
  SettingOutlined, 
  ReloadOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import './helper-bar.less';

export type HelperBarMode = 'filter' | 'search' | 'actions';

export interface HelperBarProps {
  mode: HelperBarMode;
  onModeChange: (mode: HelperBarMode) => void;
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  onSettingsClick?: () => void;
  onRefresh?: () => void;
  onAdd?: () => void;
  onDownload?: () => void;
  onUpload?: () => void;
  onDelete?: () => void;
  searchPlaceholder?: string;
  className?: string;
}

export const HelperBar: React.FC<HelperBarProps> = ({
  mode,
  onModeChange,
  onSearch,
  onFilterClick,
  onSettingsClick,
  onRefresh,
  onAdd,
  onDownload,
  onUpload,
  onDelete,
  searchPlaceholder = 'Tìm kiếm...',
  className = '',
}) => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchValue);
  };

  const renderFilterMode = () => (
    <div className="helper-bar-content">
      <Tooltip title="Tìm kiếm">
        <Button 
          type={mode === 'search' ? 'primary' : 'text'} 
          icon={<SearchOutlined />} 
          onClick={() => onModeChange?.('search')}
        />
      </Tooltip>
      <Tooltip title="Bộ lọc">
        <Button 
          type={mode === 'filter' ? 'primary' : 'text'} 
          icon={<FilterOutlined />} 
          onClick={onFilterClick}
        />
      </Tooltip>
      <Tooltip title="Cài đặt">
        <Button 
          type="text" 
          icon={<SettingOutlined />} 
          onClick={onSettingsClick}
        />
      </Tooltip>
      <Tooltip title="Làm mới">
        <Button 
          type="text" 
          icon={<ReloadOutlined />} 
          onClick={onRefresh}
        />
      </Tooltip>
    </div>
  );

  const renderSearchMode = () => (
    <form onSubmit={handleSearch} className="helper-bar-search">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={searchPlaceholder}
        className="search-input"
        autoFocus
      />
      <Button type="primary" htmlType="submit" icon={<SearchOutlined />} />
    </form>
  );

  const renderActionsMode = () => (
    <div className="helper-bar-actions">
      <Space>
        <Tooltip title="Thêm mới">
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Thêm mới
          </Button>
        </Tooltip>
        <Tooltip title="Xuất file">
          <Button icon={<DownloadOutlined />} onClick={onDownload}>
            Xuất file
          </Button>
        </Tooltip>
        <Tooltip title="Nhập file">
          <Button icon={<UploadOutlined />} onClick={onUpload}>
            Nhập file
          </Button>
        </Tooltip>
        <Tooltip title="Xóa">
          <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
            Xóa
          </Button>
        </Tooltip>
      </Space>
    </div>
  );

  return (
    <div className={`helper-bar ${className}`}>
      {mode === 'filter' && renderFilterMode()}
      {mode === 'search' && renderSearchMode()}
      {mode === 'actions' && renderActionsMode()}
    </div>
  );
};

// Export the component as default for backward compatibility
export default HelperBar;
