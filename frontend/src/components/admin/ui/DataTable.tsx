import React from 'react'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'

export type DataColumn<T> = {
  id: string
  header: string
  render: (row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

const DataTable = <T,>({
  columns,
  rows,
  loading,
  onRowClick,
  emptyTitle,
  emptyDescription,
}: {
  columns: DataColumn<T>[]
  rows: T[]
  loading?: boolean
  onRowClick?: (row: T) => void
  emptyTitle: string
  emptyDescription?: string
}) => {
  if (loading) return <LoadingState />
  if (!rows.length) return <EmptyState title={emptyTitle} description={emptyDescription} />

  const alignClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'text-center'
    if (align === 'right') return 'text-right'
    return 'text-left'
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-slate-500 ${alignClass(col.align)}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                className={`transition hover:bg-slate-50 ${onRowClick ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {columns.map((col) => (
                  <td key={col.id} className={`px-4 py-3 text-sm text-slate-700 ${alignClass(col.align)}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
