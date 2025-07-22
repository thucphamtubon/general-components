import type { ColumnsType } from 'antd/es/table';

export enum SearchMode {
  ExactMatch = 'exact',
  CaseInsensitive = 'caseInsensitive',
  AccentInsensitive = 'accentInsensitive'
}

export interface TuyChonModalProps {
  visible: boolean;
  onCancel: () => void;
  columns: ColumnsType<any>;
  onColumnsVisibilityChange: (visibleColumns: string[]) => void;
  onDownloadExcel?: () => void;
  onDownloadPdf?: () => void;
  tableTitle?: string;
  tableId: string; // ID duy nhất cho table để lưu vị trí modal
  visibleColumnKeys?: string[];
  searchMode?: SearchMode;
  initialSearchMode?: SearchMode;
  onSearchModeChange?: (mode: SearchMode) => void;
}

export interface DragState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  modalPosition: { x: number; y: number };
}