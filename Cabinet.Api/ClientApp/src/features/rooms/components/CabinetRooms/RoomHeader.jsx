import React from 'react'
import { Plus } from 'lucide-react'

export function RoomHeader({ setModal }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
      <h1 className="text-xl font-bold text-gray-800">Quản lý phòng họp</h1>
      <button
        onClick={() => setModal({ mode: 'add' })}
        className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[#a50e27] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
      >
        <Plus size={15} />
        Thêm phòng họp
      </button>
    </div>
  )
}
