# Checklist - Sorter Functionality in Table-Antd-Section

## Sorter Data Models

- **SortState** - Base model for storing sort state
  - `columnKey`: Key of the column being sorted
  - `order`: Sort direction (ascend/descend)

## Sorter Components and Hooks

### Hooks
- **useTableFiltersAndSorter**
  - Manages sort state for a specific table
  - Returns:
    - `sorter`: Current sort state
    - `setSorter(sorter: SortState)`: Set sort state directly
    - `handleSorterChange(sorter: SorterResult)`: Process antd sorter results
    - `handleTableChange(pagination, filters, sorter)`: Handle full table change events
    - `clearSorter()`: Clear only the sort state
    - `clearAll()`: Clear both filters and sorter

### Components
- **EnhancedTable**
  - Accepts `onSortChange` callback prop
  - Passes this to the useTableFiltersAndSorter hook
  - Handles sorting through the `handleTableChange` method passed to BaseTable

## Sorter Store Management

### Sorter Store
- **useTableFiltersAndSorterStore** (Zustand store)
  - `filtersAndSorterConfig`: Records of tables' filter & sorter settings
  - `setSorter(tableId, sorter)`: Update sorter for specific table
  - `clearSorter(tableId)`: Clear sorter for specific table
  - `clearAll(tableId)`: Clear all filters & sorter for specific table

### Persistence
- Sort configurations are persisted to localStorage via Zustand's persist middleware
- Configuration is unique per table ID
- User's sort preferences are preserved across page refreshes

## Sorter Implementation

### Common Sorter Utilities
- **SorterType enum**: 'id' | 'text' | 'number' | 'date'
- **sorterId()**: Special sorter for ID columns (handles numeric strings)
- **sorterText()**: Sorter for text columns with locale comparison
- **sorterNumber()**: Sorter for numeric columns
- **sorterDate()**: Sorter for date columns

### Column Configuration
- **createSorterFunction()** - Creates a sorter function for column definition
  - Parameters:
    - `columnKey`: Column key to sort by
    - `type`: Type of sorting (id/text/number/date)
  - Usage example:
    ```typescript
    {
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      sorter: createSorterFunction<any>('id', 'id')
    }
    ```

## Implementation in Projects

### ViewTable Example (Testing Section)
- Column definitions include sorter functions:
  - `createIdColumn()`: Uses `createSorterFunction<any>('id', 'id')`
  - `createNameColumn()`: Uses `createSorterFunction<any>('name', 'text')`
  - `createEmailColumn()`: Uses `createSorterFunction<any>('email', 'text')`

## API Contract

### Props
- **EnhancedTable** accepts:
  - `onSortChange`: Callback when sorting changes
  - `tableId`: Required for persistence of sort state

### Sort Object Structure
- Sort state is stored as:
  ```typescript
  {
    columnKey: string;
    order: 'ascend' | 'descend' | undefined;
  }
  ```

## Test Coverage
- Confirm that sorting works for all data types:
  - ID sorting handles mixed numeric and string IDs
  - Text sorting respects locale
  - Number sorting correctly orders numeric values
  - Date sorting correctly orders dates

## Development Considerations
- Add logging when needed using the log-for-dev module
  ```typescript
  import { logForDev, LogType, IS_LOG } from 'general-modules/log-for-dev';
  
  // Configure logging flag
  const isLoggingEnabled = IS_LOG?.tables?.sorter ?? false;
  
  // In sorting functions:
  logForDev(LogType.INFO, isLoggingEnabled, 'Sorting data', { columnKey, order, data });
  ```

## Performance Considerations
- Sorting is performed client-side in the EnhancedTable component
- For large datasets, consider server-side sorting implementation
- Memoize sorted results when possible
