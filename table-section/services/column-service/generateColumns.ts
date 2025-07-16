import { ColumnsType } from 'antd/lib/table/interface';
import { IConstants, ITableColumn } from '../../types/Table.types';
import { transformColumn, ColumnServiceOptions } from './transformColumn';

/**
 * Tạo columns từ constants của feature/page
 */
export function generateColumns<T>(
  constants: Partial<IConstants>,
  options: ColumnServiceOptions = {}
): ColumnsType<T> {
  const columns = constants?.getTableColumns?.() || [];
  return columns
    .map(column => transformColumn(column as ITableColumn, options))
    .filter(Boolean);
}
