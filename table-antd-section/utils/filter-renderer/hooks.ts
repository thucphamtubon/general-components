import { useState, useEffect } from 'react';
import { useTableFiltersAndSorterStore } from '../../stores/useTableFiltersAndSorterStore';

export const useFilterState = (tableId?: string, columnKey?: string, initialValue: string[] = []) => {
  const tableStore = useTableFiltersAndSorterStore();

  const storeFilterValue = tableId && columnKey ? tableStore.getColumnFilterValue(tableId, columnKey) : undefined;

  const [filterValue, setFilterValue] = useState<string[]>(storeFilterValue || initialValue);

  useEffect(() => {
    if (storeFilterValue !== undefined) {
      setFilterValue(storeFilterValue);
    }
  }, [storeFilterValue]);

  const updateFilterValue = (newValue: string[]) => {
    setFilterValue(newValue);
    if (tableId && columnKey) {
      tableStore.setColumnFilterValue(tableId, columnKey, newValue);
    }
  };

  const clearFilter = () => {
    setFilterValue([]);
    if (tableId && columnKey) {
      tableStore.clearColumnFilter(tableId, columnKey);
    }
  };

  return {
    filterValue,
    updateFilterValue,
    clearFilter
  };
};
