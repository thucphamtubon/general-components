import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, notification } from 'antd'
import { ColumnsType } from 'antd/lib/table/interface'
import React from 'react'
import { IConstants } from '../types/Table.types'
import { xoaDauVietNam } from '../utils/Table.logics'

// Internal highlighter component to replace react-highlight-words
const InternalHighlighter: React.FC<{
  searchWords: string[];
  textToHighlight: string;
  highlightStyle?: React.CSSProperties;
  className?: string;
  title?: string;
  autoEscape?: boolean;
}> = ({ searchWords, textToHighlight, highlightStyle, className, title, autoEscape }) => {
  const defaultStyle = { backgroundColor: '#ffc069', padding: 0 };
  const style = highlightStyle || defaultStyle;

  if (!searchWords.length || !textToHighlight) {
    return <span className={className} title={title}>{textToHighlight}</span>;
  }

  const searchWord = searchWords[0];
  if (!searchWord) {
    return <span className={className} title={title}>{textToHighlight}</span>;
  }

  const regex = autoEscape
    ? new RegExp(searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    : new RegExp(searchWord, 'gi');

  const parts = textToHighlight.split(regex);
  const matches = textToHighlight.match(regex) || [];

  return (
    <span className={className} title={title}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < matches.length && (
            <span style={style}>{matches[index]}</span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
};

function getAntColumnSearchProps(props: any = {}) {
  const { searchText, setSearchText, searchInput, onFilter } = props

  const handleSearch: any = (selectedKeys: any, confirm: any) => {
    confirm?.()
    setSearchText(selectedKeys?.[0] || null)
  }

  const handleReset: any = (clearFilters: any) => {
    if (clearFilters && setSearchText) {
      clearFilters()
      handleSearch(null)
    } else {
      notification.warning({ message: 'Đã có lỗi khi search!' })
    }
  }

  return (dataIndex: any, column: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
      return <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Nhập tìm kiếm`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={(e: any) => {
            e.stopPropagation()
            handleSearch(selectedKeys, confirm)
          }}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          autoFocus={true}
        />

        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >Search</Button>

        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >Reset</Button>
      </div>
    },
    filterIcon: (filtered: any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: any, record: any) => {
      if (onFilter && typeof onFilter === 'function') return onFilter(dataIndex, value, record)
      const parent = xoaDauVietNam(`${record?.[dataIndex] || ''}`)
      const valueSearch = xoaDauVietNam(`${value}`)

      return parent.indexOf(valueSearch) > -1
    },
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible && searchInput && searchInput.current) {
        setTimeout(() => searchInput.current.select())
      }
    },
    render: (cell: any, row: any, index: number) => {
      const classNameSearch = column?.['classNameSearch'] || ''
      const key = column.id

      let textToSearch = cell
      if (column.render) textToSearch = column.render(cell, row, index, { ...props, key })

      return (
        <InternalHighlighter
          className={classNameSearch}
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={`${textToSearch || ''}`}
          title={textToSearch}
        />
      )
    }
  })
}

function getGeneralFields(column: any = {}, props: any = {}): any {
  // Handle null or undefined columns
  if (!column || typeof column !== 'object') {
    return null;
  }

  let searchProps = {}
  let children = null

  if (column.isSearch) {
    searchProps = {
      ...getAntColumnSearchProps(props)(column?.id, column)
    }
  }

  if (column.children) {
    children = column.children.map((child: any) => getGeneralFields(child, props)).filter(Boolean)
  }

  return {
    ...column,
    key: column?.id,
    dataIndex: column?.id,
    title: column?.name,
    render(cell: any, row: any, index: number) {
      if (column.render) {
        const key = column.id

        return column.render(cell, row, index, { ...props, key })
      }

      return cell
    },
    children,
    ...searchProps
  }
}

export function getTableColumns<T>(constants: Partial<IConstants>, props: any = {}): ColumnsType<T> {
  const { sortedInfo, filteredInfo = {} } = props

  let columns = constants?.getTableColumns?.() || []

  columns = columns.map((column: any) => {
    return getGeneralFields(column, props)
  }).filter(Boolean)

  if (sortedInfo?.column?.id) {
    columns = columns.map((column: any) => {
      return { ...column, sortOrder: sortedInfo?.column?.id === column.id ? sortedInfo.order : null }
    })
  }

  columns = columns.map((column: any) => {
    return { ...column, filteredValue: filteredInfo[column.id || ''] || null }
  })

  return columns
}
