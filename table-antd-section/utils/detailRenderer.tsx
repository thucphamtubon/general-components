import { Space, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

export interface DetailItem {
  key: string;
  label: string;
  value?: any;
  render?: (value: any, record: any) => React.ReactNode;
}

export interface DetailRendererOptions {
  items: DetailItem[];
  size?: 'small' | 'middle' | 'large';
}

export const createDetailRenderer = (options: DetailRendererOptions) => {
  const { items, size = 'small' } = options;

  return function renderDetail(_: any, record: any) {
    return (
      <Space direction="vertical" size={size}>
        {items.map((item) => {
          const value = item.value !== undefined ? item.value : record[item.key];
          if (!value) return null;

          const content = item.render ? item.render(value, record) : `${item.label}: ${value}`;

          return <Text key={item.key} type="secondary">{content}</Text>;
        })}
      </Space>
    );
  };
};
