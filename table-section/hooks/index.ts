// Table hooks - explicit exports
export { useTable, TableProvider, TableContext } from './useTable';

// Specialized hooks following SRP
export { useTableSearch } from './useTableSearch';
export { useTableSelection } from './useTableSelection';
export { useTablePagination } from './useTablePagination';
export { useTableState } from './useTableState';
export { useTableOrchestrator } from './useTableOrchestrator';

// Export types
export type { UseTableSearchReturn } from './useTableSearch';
export type { UseTableSelectionReturn, UseTableSelectionOptions } from './useTableSelection';
export type { UseTablePaginationReturn, PaginationConfig } from './useTablePagination';
export type { UseTableStateReturn } from './useTableState';
export type { UseTableOrchestratorReturn, UseTableOrchestratorOptions } from './useTableOrchestrator';