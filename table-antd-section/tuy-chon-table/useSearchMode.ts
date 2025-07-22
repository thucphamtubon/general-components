import { useCallback, useEffect, useState } from 'react';
import { SearchMode } from '../types';

// Constants moved outside component to prevent recreation
const SEARCH_MODE_OPTIONS = [
  { value: SearchMode.ExactMatch, label: 'Tìm chính xác' },
  { value: SearchMode.CaseInsensitive, label: 'Không phân biệt hoa/thường' },
  { value: SearchMode.AccentInsensitive, label: 'Không phân biệt dấu' },
];

export const useSearchMode = (
  externalSearchMode?: SearchMode,
  initialSearchMode: SearchMode = SearchMode.AccentInsensitive,
  onSearchModeChange?: (mode: SearchMode) => void
) => {
  const [searchMode, setSearchMode] = useState<SearchMode>(
    externalSearchMode || initialSearchMode
  );

  useEffect(() => {
    if (externalSearchMode !== undefined) {
      setSearchMode(externalSearchMode);
    }
  }, [externalSearchMode]);

  const handleSearchModeChange = useCallback((value: SearchMode) => {
    setSearchMode(value);
    if (onSearchModeChange) {
      onSearchModeChange(value);
    }
  }, [onSearchModeChange]);

  const getSearchModeOptions = useCallback(() => SEARCH_MODE_OPTIONS, []);

  return {
    searchMode,
    handleSearchModeChange,
    getSearchModeOptions
  };
};