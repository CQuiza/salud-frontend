import { useState } from 'react'
import { Table, Spinner } from 'react-bootstrap'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  sortValue?: (item: T) => unknown
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onRowClick?: (item: T) => void
}

function getSortValue<T>(item: T, col: Column<T>): unknown {
  if (col.sortValue) return col.sortValue(item)
  return (item as Record<string, unknown>)[String(col.key)]
}

function compareValues(a: unknown, b: unknown, dir: 'asc' | 'desc'): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return dir === 'asc' ? a - b : b - a
  const aStr = String(a)
  const bStr = String(b)
  return dir === 'asc' ? aStr.localeCompare(bStr, 'es') : bStr.localeCompare(aStr, 'es')
}

export default function DataTable<T>({ columns, data, loading, onRowClick }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null)

  function handleSort(key: string) {
    if (sortKey === key) {
      if (sortDir === 'asc') { setSortDir('desc'); return }
      if (sortDir === 'desc') { setSortKey(null); setSortDir(null); return }
    }
    setSortKey(key)
    setSortDir('asc')
  }

  const colMap = new Map(columns.map((c) => [String(c.key), c]))
  const sorted = [...data].sort((a, b) => {
    if (!sortKey || !sortDir) return 0
    const col = colMap.get(sortKey)
    if (!col) return 0
    return compareValues(getSortValue(a, col), getSortValue(b, col), sortDir)
  })

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p className="small mb-0">No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <Table striped bordered hover size="sm" className="mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((col) => {
              const colKey = String(col.key)
              const canSort = col.sortable ?? colKey !== 'actions'
              const active = sortKey === colKey
              return (
                <th
                  key={colKey}
                  onClick={canSort ? () => handleSort(colKey) : undefined}
                  className={`text-center small ${canSort ? 'cursor-pointer select-none' : ''}`}
                  style={{ cursor: canSort ? 'pointer' : undefined }}
                >
                  <span className="d-inline-flex align-items-center gap-1">
                    {col.header}
                    {canSort && (
                      <span className="d-inline-flex flex-column lh-1">
                        <FaChevronUp className={`small ${active && sortDir === 'asc' ? 'text-bar-500' : 'text-muted'}`} />
                        <FaChevronDown className={`small ${active && sortDir === 'desc' ? 'text-bar-500' : 'text-muted'}`} />
                      </span>
                    )}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, idx) => (
            <tr
              key={(item as Record<string, unknown>).id as string ?? idx}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer' : ''}
              style={{ cursor: onRowClick ? 'pointer' : undefined }}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className={`text-${col.align || 'center'} align-middle`}>
                  {col.render ? col.render(item) : ((item as Record<string, unknown>)[col.key as string] as React.ReactNode) ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
