import React from 'react';
import { Select, Tooltip, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SearchMode } from '../types';
import { MODAL_CONFIG, MODAL_STYLES, SEARCH_MODE_DESCRIPTIONS } from './constants';

const { Title } = Typography;

interface SearchModeSectionProps {
  searchMode: SearchMode;
  onSearchModeChange: (mode: SearchMode) => void;
  getSearchModeOptions: () => Array<{ value: SearchMode; label: React.ReactNode }>;
}

export const SearchModeSection: React.FC<SearchModeSectionProps> = ({
  searchMode,
  onSearchModeChange,
  getSearchModeOptions
}) => {
  const selectId = 'search-mode-select';
  const tooltipId = 'search-mode-tooltip';

  return (
    <div className="search-mode-section" role="region" aria-labelledby="search-mode-title">
      <Title level={5} id="search-mode-title">Chế độ tìm kiếm</Title>
      <div style={MODAL_STYLES.searchModeContainer}>
        <Select
          id={selectId}
          value={searchMode}
          onChange={onSearchModeChange}
          style={MODAL_STYLES.searchModeSelect}
          options={getSearchModeOptions()}
          data-testid="table-search-mode-select"
          aria-label="Chọn chế độ tìm kiếm"
          aria-describedby={tooltipId}
          suffixIcon={
            <span style={MODAL_STYLES.searchModeTooltipIcon}>
              <Tooltip 
                id={tooltipId}
                title={SEARCH_MODE_DESCRIPTIONS[searchMode]} 
                overlayStyle={MODAL_STYLES.tooltipOverlay} 
                mouseEnterDelay={MODAL_CONFIG.mouseEnterDelay}
                aria-label={`Thông tin về chế độ tìm kiếm: ${SEARCH_MODE_DESCRIPTIONS[searchMode]}`}
              >
                <QuestionCircleOutlined 
                  style={MODAL_STYLES.searchModeQuestionIcon}
                  role="button"
                  tabIndex={0}
                  aria-label="Xem thông tin chi tiết về chế độ tìm kiếm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // Tooltip will show on focus
                    }
                  }}
                />
              </Tooltip>
            </span>
          }
        />
      </div>
    </div>
  );
};