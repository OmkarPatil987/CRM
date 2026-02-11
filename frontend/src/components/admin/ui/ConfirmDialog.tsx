import React from 'react'
import ActionButton from './ActionButton'

const ConfirmDialog = ({
  open,
  title,
  description,
  onClose,
  onConfirm,
}: {
  open: boolean
  title: string
  description: string
  onClose: () => void
  onConfirm: () => void
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="font-display text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <ActionButton label="Cancel" variant="outlined" onClick={onClose} />
          <ActionButton label="Confirm" variant="contained" onClick={onConfirm} />
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
