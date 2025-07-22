import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_SEARCH, DEFAULT_TABLE_ID } from '../constants';
import { getTableSearchState, useTableSearchStore } from '../stores/useTableSearchStore';
import { SearchMode, SearchState, TableSearchOptions, UseTableSearchReturn } from '../types';

// Mở rộng interface để bổ sung các tùy chọn tìm kiếm từ useTableOrchestrator
export interface ExtendedTableSearchOptions extends TableSearchOptions {
  onSearch?: (searchTerm: string) => void;
  externalSearchTerm?: string;
}

export const useTableSearch = (
  defaultSearch: SearchState = DEFAULT_SEARCH,
  options: ExtendedTableSearchOptions = {},
  defaultVisibleColumnKeys: string[] = [],
): UseTableSearchReturn & {
  handleSearchChange: (value?: string) => void;
  handleClearSearch: () => void;
} => {
  const {
    tableId = DEFAULT_TABLE_ID,
    debounceMs = 300,
    saveUserPreferences = true,
    onSearch,
    externalSearchTerm,
  } = options;

  const {
    // resetSearchConfig,
    setSearchTerm: setStoreSearchTerm,
    setSearchMode: setStoreSearchMode,
    setVisibleColumnKeys: setStoreVisibleColumnKeys,
  } = useTableSearchStore();

  const initialState = saveUserPreferences
    ? getTableSearchState(tableId, defaultSearch).searchConfig
    : defaultSearch;

  const [searchTerm, setSearchTerm] = useState<string>(initialState.searchTerm);
  const [searchMode, setSearchMode] = useState<SearchMode>(initialState.searchMode);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    initialState.visibleColumnKeys || defaultVisibleColumnKeys
  );
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(initialState.searchTerm);

  const debouncedSearch = useRef(
    debounce((searchValue: string) => {
      setDebouncedSearchTerm(searchValue);
    }, debounceMs)
  ).current;

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (saveUserPreferences) {
      setStoreSearchTerm(tableId, searchTerm);
    }
  }, [searchTerm, tableId, saveUserPreferences, setStoreSearchTerm]);

  useEffect(() => {
    if (saveUserPreferences) {
      setStoreSearchMode(tableId, searchMode);
    }
  }, [searchMode, tableId, saveUserPreferences, setStoreSearchMode]);

  useEffect(() => {
    if (saveUserPreferences) {
      setStoreVisibleColumnKeys(tableId, visibleColumnKeys);
    }
  }, [visibleColumnKeys, tableId, saveUserPreferences, setStoreVisibleColumnKeys]);

  const handleSearch = useCallback((term: string, mode?: SearchMode) => {
    setSearchTerm(term);
    if (mode !== undefined) {
      setSearchMode(mode);
    }
  }, []);

  const handleSetSearchMode = useCallback((mode: SearchMode) => {
    setSearchMode(mode);
  }, []);

  const handleSetVisibleColumnKeys = useCallback((keys: string[]) => {
    setVisibleColumnKeys(keys);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // resetSearch function removed as it was unused

  // Handler cho việc thay đổi tìm kiếm
  const handleSearchChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setSearchTerm(value);
      if (onSearch) {
        onSearch(value);
      }
    } else if (externalSearchTerm !== undefined) {
      setSearchTerm(externalSearchTerm);
      if (onSearch) {
        onSearch(externalSearchTerm);
      }
    }
  }, [setSearchTerm, externalSearchTerm, onSearch]);

  // Handler cho việc xóa tìm kiếm
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  }, [setSearchTerm, onSearch]);

  // Xử lý khi có external search term
  useEffect(() => {
    if (externalSearchTerm !== undefined) {
      setSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  return {
    searchTerm,
    debouncedSearchTerm,
    searchMode,
    visibleColumnKeys,
    setSearchTerm,
    setSearchMode: handleSetSearchMode,
    setVisibleColumnKeys: handleSetVisibleColumnKeys,
    handleSearch,
    handleSearchChange,
    handleClearSearch,
    clearSearch,
  };
};
