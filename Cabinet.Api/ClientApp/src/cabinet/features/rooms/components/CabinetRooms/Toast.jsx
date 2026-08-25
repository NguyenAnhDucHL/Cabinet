import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const color =
    type === 'success'
      ? 'bg-green-50 border-green-400 text-green-800'
      : 'bg-red-50 border-red-400 text-red-800'
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle

  return (
    <div
      className={`fixed bottom-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm text-sm font-medium ${color}`}
    >
      <Icon size={17} className="shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  )
}
