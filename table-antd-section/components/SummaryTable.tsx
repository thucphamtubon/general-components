import { Table } from 'antd'

const { Summary } = Table
const { Row, Cell } = Summary

type Props = {
  columns: any
  dataSource: any
}

export const SummaryTable = (props: Props) => {
  const { columns, dataSource } = props

  return <Row data-testid="summary-table-row">
    {
      columns?.map?.((column: any, index: number) => {
        const columnId = column?.id
        const colSpan = column?.colSpan || 0
        const cellClassName = column?.cellClassName || ''

        const valueStyle = column?.valueStyle || {}
        const valueClassName = column?.valueClassName || ''
        const render = column?.render

        const data = dataSource?.[index] || {}

        let value = data?.[columnId] || ''
        if (render) value = render(value, data, index)

        return <Cell
          index={index}
          key={columnId}
          colSpan={colSpan}
          className={cellClassName}
          data-testid={`summary-cell-${columnId || index}`}
        >
          <div
            style={valueStyle}
            className={valueClassName}
            data-testid={`summary-cell-value-${columnId || index}`}
          >
            {value}
          </div>
        </Cell>
      })
    }
  </Row>
}
