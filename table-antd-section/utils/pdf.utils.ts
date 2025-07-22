import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import { PDF_CONSTANTS } from '../constants';
import { PdfOrientation, PdfPageSize } from '../types';

export const initPdfMake = (): void => {
  if (!pdfMake.vfs) {
    const vfs = (pdfFonts as any).pdfMake ?
      (pdfFonts as any).pdfMake.vfs :
      (pdfFonts as any).vfsFonts?.pdfMake?.vfs || {};
    if (vfs) {
      pdfMake.vfs = vfs;
    }
  }
};

initPdfMake();

export interface PdfExportOptions {
  fileName?: string;
  title?: string;
  orientation?: PdfOrientation;
  pageSize?: PdfPageSize;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  addTitle?: boolean;
  addTimestamp?: boolean;
  addPageNumbers?: boolean;
  headerColor?: string;
  titleFontSize?: number;
  addCompanyLogo?: boolean;
  companyLogoUrl?: string;
  tableHeaderStyle?: any;
  tableBodyStyle?: any;
}

const defaultPdfOptions: PdfExportOptions = {
  fileName: 'Table_Data',
  title: 'Dữ liệu bảng',
  orientation: PDF_CONSTANTS.ORIENTATION.LANDSCAPE,
  pageSize: PDF_CONSTANTS.PAGE_SIZE.A4,
  margin: {
    top: PDF_CONSTANTS.DEFAULT_PAGE_MARGINS[0],
    right: PDF_CONSTANTS.DEFAULT_PAGE_MARGINS[1],
    bottom: PDF_CONSTANTS.DEFAULT_PAGE_MARGINS[2],
    left: PDF_CONSTANTS.DEFAULT_PAGE_MARGINS[3],
  },
  addTitle: true,
  addTimestamp: true,
  addPageNumbers: true,
  headerColor: '#f5f5f5',
  titleFontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE.TITLE,
  addCompanyLogo: false,
  companyLogoUrl: '',
  tableHeaderStyle: {
    fillColor: '#f5f5f5',
    bold: true,
    fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE.BODY,
    color: 'black',
    alignment: 'center',
    margin: [1, 1, 1, 1]
  },
  tableBodyStyle: {
    fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE.BODY,
    color: 'black',
    margin: [1, 1, 1, 1]
  }
};

const normalizeDocDefinition = (docDefinition: TDocumentDefinitions, options: PdfExportOptions): TDocumentDefinitions => {
  return {
    pageSize: options.pageSize || PDF_CONSTANTS.PAGE_SIZE.A4,
    pageOrientation: options.orientation || PDF_CONSTANTS.ORIENTATION.LANDSCAPE,
    pageMargins: [
      options.margin?.left || PDF_CONSTANTS.DEFAULT_PAGE_MARGINS[3],
      options.margin?.top || PDF_CONSTANTS.DEFAULT_PAGE_MARGINS[0],
      options.margin?.right || PDF_CONSTANTS.DEFAULT_PAGE_MARGINS[1],
      options.margin?.bottom || PDF_CONSTANTS.DEFAULT_PAGE_MARGINS[2],
    ],
    ...docDefinition,
  } as TDocumentDefinitions;
};

const createAndDownloadPdf = (
  docDefinition: TDocumentDefinitions,
  options: PdfExportOptions
): void => {
  initPdfMake();
  const fileName = options.fileName ?
    `${options.fileName}_${new Date().toISOString().split('T')[0]}.pdf` :
    `Table_Data_${new Date().toISOString().split('T')[0]}.pdf`;
  const normalizedDoc = normalizeDocDefinition(docDefinition, options);
  pdfMake.createPdf(normalizedDoc).download(fileName);
};

export const exportToPdf = async (
  columns: any[],
  dataSource: any[],
  options?: Partial<PdfExportOptions>
): Promise<void> => {
  if (!columns || !dataSource) {
    console.warn('Dữ liệu cột hoặc nguồn không hợp lệ');
    return;
  }
  try {
    const mergedOptions: PdfExportOptions = {
      ...defaultPdfOptions,
      ...options,
      margin: {
        ...defaultPdfOptions.margin,
        ...(options?.margin || {})
      }
    };
    const tableData: TableCell[][] = [];
    const headerRow: TableCell[] = columns.map(column => ({
      text: column.title || '',
      style: 'tableHeader'
    }));
    tableData.push(headerRow);
    dataSource.forEach(item => {
      const rowData: TableCell[] = columns.map((column, index) => {
        const dataIndex = column.dataIndex;
        const value = item[dataIndex];
        return {
          text: value !== undefined && value !== null ? String(value) : '',
          style: 'tableBody'
        };
      });
      tableData.push(rowData);
    });
    const content: any[] = [];
    if (mergedOptions.addCompanyLogo && mergedOptions.companyLogoUrl) {
      content.push({
        image: mergedOptions.companyLogoUrl,
        width: 60,
        margin: [mergedOptions.margin?.left || 10, 0, 0, 10]
      });
    }
    if (mergedOptions.addTitle) {
      content.push({
        text: mergedOptions.title || 'Dữ liệu bảng',
        style: 'title',
        margin: [mergedOptions.margin?.left || 10, 0, 0, 10],
        fontSize: mergedOptions.titleFontSize || PDF_CONSTANTS.DEFAULT_FONT_SIZE.TITLE,
        bold: true
      });
    }
    if (mergedOptions.addTimestamp) {
      content.push({
        text: `Xuất ngày: ${new Date().toLocaleDateString('vi-VN')}`,
        style: 'timestamp',
        margin: [mergedOptions.margin?.left || 10, 0, 0, 10],
        fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE.HEADER,
        color: '#666666'
      });
    }
    content.push({
      table: {
        headerRows: 1,
        widths: Array(tableData[0]?.length || 0).fill('*'),
        body: tableData,
      },
      layout: 'lightHorizontalLines',
      margin: [
        mergedOptions.margin?.left || 10,
        5,
        mergedOptions.margin?.right || 10,
        5
      ]
    });
    const docDefinition: TDocumentDefinitions = {
      content: content,
      styles: {
        title: {
          fontSize: mergedOptions.titleFontSize || PDF_CONSTANTS.DEFAULT_FONT_SIZE.TITLE,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        tableHeader: mergedOptions.tableHeaderStyle || {
          fillColor: mergedOptions.headerColor || '#f5f5f5',
          bold: true,
          fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE.BODY,
          color: 'black',
          alignment: 'center',
          margin: [1, 1, 1, 1]
        },
        tableBody: mergedOptions.tableBodyStyle || {
          fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE.BODY,
          color: 'black',
          margin: [1, 1, 1, 1]
        },
        timestamp: {
          fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE.HEADER,
          color: '#666666',
          margin: [0, 0, 0, 10]
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };
    if (mergedOptions.addPageNumbers) {
      docDefinition.footer = (currentPage: number, pageCount: number) => ({
        text: `Trang ${currentPage} / ${pageCount}`,
        alignment: 'right',
        margin: [0, 10, 10, 0],
        fontSize: PDF_CONSTANTS.DEFAULT_FONT_SIZE.FOOTER,
        color: '#666666'
      });
    }
    createAndDownloadPdf(docDefinition, mergedOptions);
  } catch (error) {
    console.error('Lỗi khi xuất PDF:', error);
  }
};
