import { Tag } from 'antd';

export interface TagOption {
  value: string;
  label: string;
  color: string;
}

/**
 * Creates a render function for antd Tags based on a list of options.
 * @param options An array of objects with value, label, and color.
 * @returns A function that takes a value and returns a Tag component.
 */
export const createTagRenderer = (options: TagOption[]) => {
  return function renderTag(value: string) {
    const option = options.find(opt => opt.value === value);
    if (option) {
      return <Tag color={option.color}>{option.label}</Tag>;
    }
    return <Tag>{value}</Tag>;
  };
}; 