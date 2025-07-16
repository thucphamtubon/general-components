// === MAIN EXPORTS ===
// Components
export { 
  SummaryTable,
  EnhancedAppTable,
  TableHeader,
  TableSearchBar,
  TableSelectionInfo 
} from './components';

// Hooks - Legacy
export { useTable, TableProvider } from './hooks/useTable';
export { useSearchText } from './utils/Table.logics';

// Hooks - New SRP-based
export {
  useTableSearch,
  useTableSelection,
  useTablePagination,
  useTableState,
  useTableOrchestrator
} from './hooks';

// Services - Legacy
export { getTableColumns } from './services/table.services';

// Services - New SRP-based
export * from './services/search.service';
export * from './services/column-service';

// Types
export type {
  IConstantItem,
  ITableColumn,
  IConstants,
  ActionsReturn,
  TableState,
  AppState,
  TableContextState,
  TableContextType,
  UseTableReturn,
  InputOptions,
  AppDispatch,
  AppStateSelector,
  Noop
} from './types/Table.types';

// Component types
export type {
  EnhancedAppTableProps,
  TableHeaderProps,
  TableSearchBarProps,
  TableSelectionInfoProps
} from './components';

// New hook types
export type {
  UseTableSearchReturn,
  UseTableSelectionReturn,
  UseTableSelectionOptions,
  UseTablePaginationReturn,
  PaginationConfig,
  UseTableStateReturn,
  UseTableOrchestratorReturn,
  UseTableOrchestratorOptions
} from './hooks';

// Utilities
export {
  xoaDauVietNam,
  noop,
  useStates,
  useAppState,
  useAppDispatch,
  onChangeSelectedRowKeys,
  thongBaoQuyenChinhSua
} from './utils/Table.logics';

