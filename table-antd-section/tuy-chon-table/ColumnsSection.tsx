import React from 'react';
import { Button, Col, Row, Switch, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { COLUMN_RESPONSIVE, GRID_CONFIG, MODAL_STYLES } from './constants';

const { Title, Text } = Typography;

interface ColumnsSectionProps {
  columns: ColumnsType<any>;
  selectedColumns: string[];
  onColumnVisibilityChange: (columnKey: string, checked: boolean) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

export const ColumnsSection: React.FC<ColumnsSectionProps> = ({
  columns,
  selectedColumns,
  onColumnVisibilityChange,
  onShowAll,
  onHideAll
}) => {
  return (
    <div className="columns-section" role="region" aria-labelledby="columns-section-title">
      <div className="columns-header" style={MODAL_STYLES.columnsHeader}>
        <Title level={5} style={MODAL_STYLES.columnsTitle} id="columns-section-title">
          Hiển thị cột
        </Title>
        <div role="group" aria-label="Điều khiển hiển thị cột">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={onShowAll}
            style={MODAL_STYLES.showAllButton}
            aria-label="Hiển thị tất cả các cột"
            title="Hiển thị tất cả các cột"
          >
            Tất cả
          </Button>
          <Button
            size="small"
            icon={<EyeInvisibleOutlined />}
            onClick={onHideAll}
            aria-label="Ẩn tất cả các cột (giữ lại cột đầu tiên)"
            title="Ẩn tất cả các cột (giữ lại cột đầu tiên)"
          >
            Ẩn tất cả
          </Button>
        </div>
      </div>

      <Row gutter={GRID_CONFIG.columnsSection} role="group" aria-labelledby="columns-section-title">
        {columns.map((column) => {
          const columnDef = column as ColumnType<any>;
          const columnKey = (columnDef.key || columnDef.dataIndex) as string;
          const columnTitle = columnDef.title as string;

          if (!columnKey) return null;

          const isChecked = selectedColumns.includes(columnKey);
          const switchId = `column-switch-${columnKey}`;

          const handleTextClick = () => {
            onColumnVisibilityChange(columnKey, !isChecked);
          };

          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTextClick();
            }
          };

          return (
            <Col {...COLUMN_RESPONSIVE.columnItem} key={columnKey}>
              <div style={MODAL_STYLES.columnItem} role="group" aria-labelledby={switchId}>
                <Switch
                  id={switchId}
                  checked={isChecked}
                  onChange={(checked) => onColumnVisibilityChange(columnKey, checked)}
                  size="small"
                  aria-label={`${isChecked ? 'Ẩn' : 'Hiển thị'} cột ${columnTitle}`}
                />
                <Text
                  style={{ ...MODAL_STYLES.columnText, cursor: 'pointer' }}
                  onClick={handleTextClick}
                  onKeyDown={handleKeyDown}
                  tabIndex={0}
                  role="button"
                  aria-label={`Bấm để ${isChecked ? 'ẩn' : 'hiển thị'} cột ${columnTitle}`}
                  title={`Bấm để ${isChecked ? 'ẩn' : 'hiển thị'} cột ${columnTitle}`}
                >
                  {columnTitle}
                </Text>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};