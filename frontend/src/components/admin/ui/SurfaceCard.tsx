import React from 'react'

const SurfaceCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur">
      {children}
    </div>
  )
}

export default SurfaceCard
