import React from 'react';
import { Button, Col, Row, Typography } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { COLUMN_RESPONSIVE, GRID_CONFIG, MODAL_STYLES, UI_LABELS, ARIA_LABELS } from './constants';

const { Title: AntTitle } = Typography;

interface ExportSectionProps {
  onDownloadExcel?: () => void;
  onDownloadPdf?: () => void;
  isExporting?: boolean;
  exportType?: 'excel' | 'pdf' | null;
}

export const ExportSection: React.FC<ExportSectionProps> = ({
  onDownloadExcel,
  onDownloadPdf,
  isExporting = false,
  exportType = null
}) => {
  if (!onDownloadExcel && !onDownloadPdf) {
    return null;
  }

  const isExcelLoading = isExporting && exportType === 'excel';
  const isPdfLoading = isExporting && exportType === 'pdf';

  return (
    <div className="export-section" role="region" aria-labelledby="export-section-title">
      <AntTitle 
        level={5} 
        id="export-section-title"
        style={{ marginBottom: 16 }}
      >
        {UI_LABELS.EXPORT_SECTION_TITLE}
      </AntTitle>
      <Row gutter={GRID_CONFIG.exportSection} role="group" aria-labelledby="export-section-title">
        {onDownloadExcel && (
          <Col {...COLUMN_RESPONSIVE.exportButton}>
            <Button 
              icon={isExcelLoading ? <LoadingOutlined spin /> : <FileExcelOutlined />}
              onClick={onDownloadExcel} 
              block 
              style={{
                ...MODAL_STYLES.exportButton,
                opacity: isExporting && !isExcelLoading ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
              disabled={isExporting}
              loading={isExcelLoading}
              aria-label={isExcelLoading ? "Đang xuất Excel..." : ARIA_LABELS.EXPORT_EXCEL || "Xuất dữ liệu ra file Excel"}
              title={isExcelLoading ? "Đang xuất Excel..." : "Xuất dữ liệu ra file Excel"}
              type={isExcelLoading ? "primary" : "default"}
            >
              <div style={MODAL_STYLES.exportButtonText}>
                {isExcelLoading ? "Đang xuất..." : UI_LABELS.EXPORT_EXCEL}
              </div>
            </Button>
          </Col>
        )}
        {onDownloadPdf && (
          <Col {...COLUMN_RESPONSIVE.exportButton}>
            <Button 
              icon={isPdfLoading ? <LoadingOutlined spin /> : <FilePdfOutlined />}
              onClick={onDownloadPdf} 
              block 
              style={{
                ...MODAL_STYLES.exportButton,
                opacity: isExporting && !isPdfLoading ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
              disabled={isExporting}
              loading={isPdfLoading}
              aria-label={isPdfLoading ? "Đang xuất PDF..." : ARIA_LABELS.EXPORT_PDF || "Xuất dữ liệu ra file PDF"}
              title={isPdfLoading ? "Đang xuất PDF..." : "Xuất dữ liệu ra file PDF"}
              type={isPdfLoading ? "primary" : "default"}
            >
              <div style={MODAL_STYLES.exportButtonText}>
                {isPdfLoading ? "Đang xuất..." : UI_LABELS.EXPORT_PDF}
              </div>
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
};