import React from 'react';
import { TableSearchBar, TableSearchBarProps } from '../TableSearchBar/TableSearchBar';
import { TableSelectionInfo, TableSelectionInfoProps } from '../TableSelectionInfo/TableSelectionInfo';
import './TableHeader.less';

export interface TableHeaderProps {
  // Search configuration
  enableSearch?: boolean;
  searchProps?: Omit<TableSearchBarProps, 'searchText' | 'onSearchChange' | 'onClearSearch'> & {
    searchText?: string;
    onSearchChange?: (text: string) => void;
    onClearSearch?: () => void;
  };
  
  // Selection configuration
  enableSelection?: boolean;
  selectionProps?: Omit<TableSelectionInfoProps, 'selectedCount' | 'onClearSelection'> & {
    selectedCount?: number;
    onClearSelection?: () => void;
  };
  
  // Additional content
  children?: React.ReactNode;
  
  // Layout
  className?: string;
  style?: React.CSSProperties;
  
  // Live region for accessibility
  liveRegionContent?: string;
}

/**
 * TableHeader component following SRP
 * - Kết hợp search và selection components
 * - Có thể mở rộng với custom content
 * - Dễ test và maintain
 */
export function TableHeader(props: TableHeaderProps) {
  const {
    enableSearch = true,
    searchProps = {},
    enableSelection = true,
    selectionProps = {},
    children,
    className = '',
    style,
    liveRegionContent,
  } = props;

  // Don't render if nothing to show
  const hasSearchBar = enableSearch && searchProps.searchText !== undefined;
  const hasSelectionInfo = enableSelection && (selectionProps.selectedCount || 0) > 0;
  const hasChildren = Boolean(children);
  const hasLiveRegion = Boolean(liveRegionContent);

  if (!hasSearchBar && !hasSelectionInfo && !hasChildren && !hasLiveRegion) {
    return null;
  }

  return (
    <div className={`table-header ${className}`} style={style}>
      {/* Live region for screen readers */}
      {hasLiveRegion && (
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          className="table-header__live-region sr-only"
          data-testid="table-header-live-region"
        >
          {liveRegionContent}
        </div>
      )}

      {/* Search section */}
      {hasSearchBar && searchProps.searchText !== undefined && searchProps.onSearchChange && searchProps.onClearSearch && (
        <div className="table-header__search" data-testid="table-header-search">
          <TableSearchBar 
            searchText={searchProps.searchText}
            onSearchChange={searchProps.onSearchChange}
            onClearSearch={searchProps.onClearSearch}
            placeholder={searchProps.placeholder}
            className={searchProps.className}
            style={searchProps.style}
            disabled={searchProps.disabled}
            width={searchProps.width}
          />
        </div>
      )}

      {/* Selection info section */}
      {hasSelectionInfo && selectionProps.selectedCount !== undefined && selectionProps.onClearSelection && (
        <div className="table-header__selection" data-testid="table-header-selection">
          <TableSelectionInfo 
            selectedCount={selectionProps.selectedCount}
            onClearSelection={selectionProps.onClearSelection}
            className={selectionProps.className}
            style={selectionProps.style}
            disabled={selectionProps.disabled}
            showClearButton={selectionProps.showClearButton}
            countText={selectionProps.countText}
            clearButtonText={selectionProps.clearButtonText}
          />
        </div>
      )}

      {/* Custom content */}
      {hasChildren && (
        <div className="table-header__custom" data-testid="table-header-custom">
          {children}
        </div>
      )}
    </div>
  );
}

export default TableHeader; 