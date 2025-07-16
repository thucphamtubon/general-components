import { useState, useCallback, useRef, useEffect } from 'react';
import { useDebounce } from '../utils/useDebounce';
import { xoaDauVietNam } from '../utils/Table.logics';

export interface UseTableSearchReturn {
  searchText: string;
  setSearchText: (text: string) => void;
  searchInput: React.RefObject<any>;
  clearSearch: () => void;
  filterBySearch: (data: any[], searchableFields: string[]) => any[];
  isSearching: boolean;
}

export function useTableSearch(): UseTableSearchReturn {
  const [searchText, setSearchText] = useState('');
  // Debounce to avoid expensive filtering on each keystroke
  const debouncedSearchText = useDebounce(searchText, 300);
  const [isSearching, setIsSearching] = useState(false);
  const searchInput = useRef<any>(null);

  const clearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  const handleSetSearchText = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const filterBySearch = useCallback((data: any[], searchableFields: string[]) => {
    if (!debouncedSearchText.trim()) {
      return data;
    }

    const normalizedSearchText = xoaDauVietNam(debouncedSearchText.toLowerCase());
    
    return data.filter(item => {
      return searchableFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        
        const normalizedValue = xoaDauVietNam(String(value).toLowerCase());
        return normalizedValue.includes(normalizedSearchText);
      });
    });
  }, [debouncedSearchText]);

  // Update searching state whenever debounced value changes
  useEffect(() => {
    setIsSearching(Boolean(debouncedSearchText));
  }, [debouncedSearchText]);

  return {
    searchText,
    setSearchText: handleSetSearchText,
    searchInput,
    clearSearch,
    filterBySearch,
    isSearching,
  };
} 