import { FilterState, PaginationState, SearchMode, SearchState, SortState } from "./types";

export const DEFAULT_PAGINATION: PaginationState = {
  current: 1,
  pageSize: 25,
};

export const DEFAULT_SEARCH: SearchState = {
  searchTerm: '',
  searchMode: SearchMode.AccentInsensitive,
  visibleColumnKeys: [],
};

export const DEFAULT_FILTERS: FilterState = {};

export const DEFAULT_SORTER: SortState = {};

export const DEFAULT_TABLE_ID = 'default-table';

export const DEFAULT_FILTERS_AND_SORTER = {
  tableId: DEFAULT_TABLE_ID,
  filters: DEFAULT_FILTERS,
  sorter: DEFAULT_SORTER,
};

export const DEFAULT_PAGE_SIZE_OPTIONS = ['10', '25', '50', '100', '200'];

export const PDF_CONSTANTS = {
  PAGE_SIZE: {
    A4: 'A4' as const,
    A3: 'A3' as const,
    LETTER: 'LETTER' as const,
    LEGAL: 'LEGAL' as const
  },
  ORIENTATION: {
    PORTRAIT: 'portrait' as const,
    LANDSCAPE: 'landscape' as const
  },
  DEFAULT_PAGE_MARGINS: [10, 10, 10, 10] as [number, number, number, number],
  DEFAULT_FONT_SIZE: {
    TITLE: 14,
    HEADER: 10,
    BODY: 9,
    FOOTER: 8
  }
};