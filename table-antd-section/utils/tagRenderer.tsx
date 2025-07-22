import { Tag } from 'antd';

export interface TagOption {
  value: string;
  label: string;
  color?: string;
}

export const createTagRenderer = (options: TagOption[]) => {
  return function renderTag(value: string) {
    const option = options.find(opt => opt.value === value);
    if (option) {
      return <Tag color={option?.color || '#FFFFFF'}>{option.label}</Tag>;
    }
    return <Tag>{value}</Tag>;
  };
}; 