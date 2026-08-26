import React from 'react'
import { ChevronRight } from 'lucide-react'

export function SectionCard({ title, count, children, showAction = false }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-[#1a202c] text-base">
          {title} {count !== undefined && `(${count})`}
        </h2>
        {showAction && (
          <button className="text-xs text-[#c8102e] border border-[#c8102e] px-2 py-0.5 rounded flex items-center hover:bg-red-50 transition">
            Xem tất cả <ChevronRight size={12} className="ml-0.5" />
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
