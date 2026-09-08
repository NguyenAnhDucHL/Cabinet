import React from 'react'
import { Plus, Search, Filter } from 'lucide-react'

export function QuestionnaireHeader({ setMode }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
      <h1 className="text-xl font-bold text-gray-800">Quản lý phiếu lấy ý kiến</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm phiếu..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] w-64 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Filter size={16} />
          Lọc
        </button>
        <button
          onClick={() => setMode('create')}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[#a50e27] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Thêm mới
        </button>
      </div>
    </div>
  )
}
