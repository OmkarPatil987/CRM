import React from 'react'

const StatusChip = ({ label, color }: { label: string; color: 'success' | 'warning' | 'error' | 'info' | 'default' }) => {
  const colorMap = {
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    error: 'bg-rose-50 text-rose-700 ring-rose-200',
    info: 'bg-sky-50 text-sky-700 ring-sky-200',
    default: 'bg-slate-100 text-slate-700 ring-slate-200',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${colorMap[color]}`}
    >
      {label}
    </span>
  )
}

export default StatusChip
