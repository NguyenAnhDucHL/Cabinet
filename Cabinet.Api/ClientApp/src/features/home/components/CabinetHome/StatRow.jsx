import React from 'react'

export function StatRow({ color, label, value, percent }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        <span className={`w-4 h-4 rounded-md ${color}`} />
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
      <div className="flex gap-6 text-sm text-gray-800">
        <span className="w-12 text-right font-bold">{value}</span>
        <span className="w-16 text-right">{percent.toFixed(2)}</span>
      </div>
    </div>
  )
}
