import React from 'react'

const DetailTabs = ({
  value,
  onChange,
  labels,
}: {
  value: number
  onChange: (value: number) => void
  labels: string[]
}) => {
  return (
    <div className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm shadow-slate-200/60 backdrop-blur">
      {labels.map((label, index) => {
        const isActive = value === index
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-primary text-white shadow-sm shadow-indigo-200/60'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            onClick={() => onChange(index)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default DetailTabs
