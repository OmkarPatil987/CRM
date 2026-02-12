import React from 'react'

const SurfaceCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur ${className || ''}`}>
            {children}
        </div>
    )
}

export default SurfaceCard
