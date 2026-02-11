import React from 'react'

const EmptyState = ({ title, description }: { title: string; description?: string }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 px-6 py-10 text-center shadow-sm shadow-slate-200/60">
      <p className="font-display text-lg font-semibold text-slate-800">{title}</p>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
    </div>
  )
}

export default EmptyState
