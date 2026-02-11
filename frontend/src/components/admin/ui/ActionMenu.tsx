import React, { useEffect, useRef, useState } from 'react'
import { MoreVert } from '@mui/icons-material'

const ActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleAction = (event: React.MouseEvent, action?: () => void) => {
    event.stopPropagation()
    setOpen(false)
    action?.()
  }

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open action menu"
        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
        onClick={(event) => {
          event.stopPropagation()
          setOpen((prev) => !prev)
        }}
      >
        <MoreVert className="text-lg" fontSize="inherit" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-xl border border-slate-200 bg-white/95 p-1 shadow-lg shadow-slate-200/60 backdrop-blur"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            onClick={(event) => handleAction(event, onView)}
          >
            View
          </button>
          {onEdit && (
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              onClick={(event) => handleAction(event, onEdit)}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
              onClick={(event) => handleAction(event, onDelete)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ActionMenu
