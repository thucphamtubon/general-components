import writeXlsxFile, { Cell, ColumnSchema, ValueType } from 'write-excel-file';
import { ColumnsType, TableRecord } from '../types';

type ExcelCellStyle = Cell & {
  color?: string;
  align?: 'center' | 'left' | 'right';
  alignVertical?: 'center' | 'top' | 'bottom';
  height?: number;
  fontSize?: number;
  borderColor?: string;
  borderStyle?: 'thin' | 'medium' | 'thick';
}

type ExcelExportOptions = {
  fileName?: string;
  headerStyle?: Partial<ExcelCellStyle>;
  bodyStyle?: Partial<ExcelCellStyle>;
  dateFormat?: string;
  columnWidth?: number[];
  rowHeight?: number;
  showErrors?: boolean;
}

const defaultBorderStyle = {
  borderColor: '#D3D3D3',
  borderStyle: 'thin' as const,
  alignVertical: 'center' as const,
  wrap: true,
};

const defaultExcelOptions: ExcelExportOptions = {
  fileName: 'Table_Data',
  headerStyle: {
    color: '#000000',
    align: 'center',
    fontSize: 12,
    height: 24,
    ...defaultBorderStyle
  },
  bodyStyle: {
    fontSize: 11,
    height: 20,
    ...defaultBorderStyle
  },
  dateFormat: 'YYYY-MM-DD',
  rowHeight: 20,
  showErrors: false,
};

const formatCellValue = (value: any): { formattedValue: any; type: string; } => {
  if (value === null || value === undefined) {
    return { formattedValue: '', type: 'string' };
  }

  let type = 'string';
  let formattedValue = value;

  if (typeof value === 'number') {
    type = 'number';
    return { formattedValue, type };
  } else if (typeof value === 'boolean') {
    type = 'boolean';
  }

  return { formattedValue, type };
};

const getCellStyle = (isHeader: boolean, options: ExcelExportOptions, cellType?: string) => {
  const baseStyle = isHeader ? options.headerStyle : options.bodyStyle;
  return {
    ...defaultBorderStyle,
    fontSize: baseStyle?.fontSize || (isHeader ? 12 : 11),
    align: baseStyle?.align || (isHeader ? 'center' : (cellType === 'number' ? 'right' : 'left')),
    alignVertical: baseStyle?.alignVertical || 'center',
    height: baseStyle?.height || (isHeader ? 24 : 20),
    color: baseStyle?.color,
    wrap: true,
  };
};

const createExcelSchema = (visibleColumns: ColumnsType<any>, options: ExcelExportOptions): ColumnSchema<any, ValueType>[] => {
  return visibleColumns.map((column) => {
    const columnKey = (column.key || column.dataIndex) as string;
    const headerStyle = getCellStyle(true, options);

    return {
      column: column.title as string,
      value: (row: any) => row[columnKey],
      type: String,
      width: 20,
      ...headerStyle
    } as ColumnSchema<any, ValueType>;
  });
};

const showExcelError = (error: unknown, showDetailedErrors: boolean): void => {
  console.error('Error exporting to Excel:', error);
  if (showDetailedErrors) {
    alert(`Lỗi khi xuất file Excel: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
  } else {
    alert('Không thể tạo file Excel. Vui lòng thử lại sau.');
  }
};

const generateFileName = (baseName: string): string => {
  return `${baseName}_${new Date().toISOString().split('T')[0]}.xlsx`;
};

export const exportToExcel = async <RecordType extends TableRecord = TableRecord>(
  columns: ColumnsType<RecordType>,
  data: RecordType[],
  visibleColumnKeys: string[],
  options?: Partial<ExcelExportOptions>
): Promise<void> => {
  if (!data || data.length === 0) return;

  try {
    const mergedOptions = { ...defaultExcelOptions, ...options };

    const visibleColumns = columns.filter((col) => {
      const columnKey = (col.key || col.dataIndex) as string;
      return visibleColumnKeys.includes(columnKey);
    });

    const schema = createExcelSchema(visibleColumns, mergedOptions);
    const fileName = generateFileName(mergedOptions.fileName || 'Table_Data');

    // Transform data to expected format
    const excelData: any[] = data.map(record => {
      const rowData: Record<string, any> = {};

      visibleColumns.forEach((col) => {
        const columnKey = (col.key || col.dataIndex) as string;
        const value = record[columnKey];

        const { formattedValue } = formatCellValue(value);

        rowData[columnKey] = formattedValue;
      });

      return rowData;
    });

    await writeXlsxFile(excelData, { fileName, fontFamily: 'Arial', schema });

  } catch (error) {
    const errorOptions = { ...defaultExcelOptions, ...options };
    showExcelError(error, !!errorOptions.showErrors);
  }
};
