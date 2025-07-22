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
import { ReactNode } from 'react';

export const MODES = {
  FILTER: 'filter',
  SEARCH: 'search',
  ACTIONS: 'actions',
} as const;

interface ButtonConfig {
  key: string;
  icon: ReactNode;
  tooltip?: string;
  text?: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  danger?: boolean;
}

export const BUTTONS: { [key: string]: ButtonConfig[] } = {
  [MODES.FILTER]: [
    {
      key: 'search',
      icon: <SearchOutlined />,
      tooltip: 'Tìm kiếm',
    },
    {
      key: 'filter',
      icon: <FilterOutlined />,
      tooltip: 'Bộ lọc',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      tooltip: 'Cài đặt',
    },
    {
      key: 'refresh',
      icon: <ReloadOutlined />,
      tooltip: 'Làm mới',
    },
  ],
  [MODES.ACTIONS]: [
    {
      key: 'add',
      icon: <PlusOutlined />,
      text: 'Thêm mới',
      type: 'primary' as const,
    },
    {
      key: 'download',
      icon: <DownloadOutlined />,
      text: 'Xuất file',
    },
    {
      key: 'upload',
      icon: <UploadOutlined />,
      text: 'Nhập file',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      text: 'Xóa',
      danger: true,
    },
  ],
};

export const MESSAGES = {
  SEARCH_PLACEHOLDER: 'Tìm kiếm...',
  DEFAULT_ACTION: 'Chưa có hành động nào',
  SEARCH_ACTION: (query: string) => `Đã tìm kiếm: ${query}`,
  ACTION_PERFORMED: (action: string) => `Đã thực hiện: ${action}`,
};

export const DEMO_TEXTS = {
  TITLE: 'Demo Helper Bar',
  CURRENT_MODE: (mode: string) => `Chế độ hiện tại: ${mode}`,
  SEARCHING_FOR: (query: string) => `Đang tìm kiếm: ${query}`,
  LAST_ACTION: 'Hành động gần nhất:',
  INSTRUCTION: 'Thử chuyển đổi giữa các chế độ bằng cách nhấn vào các nút tương ứng trên thanh công cụ.',
};
