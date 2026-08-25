import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function MeetingPagination({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalItems,
}) {
  const totalPages = Math.ceil(totalItems / pageSize)

  if (totalItems === 0) return null

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <div className="text-gray-500">
        {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} /{' '}
        {totalItems} bản ghi
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="px-2 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            «
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1.5 text-gray-500 hover:bg-gray-50 border-x border-gray-200 disabled:opacity-50"
          >
            ‹
          </button>
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            let pageNum = i + 1
            if (totalPages > 5 && currentPage > 3) pageNum = currentPage - 2 + i
            if (pageNum > totalPages) return null
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 py-1.5 font-medium transition ${currentPage === pageNum ? 'bg-[#c8102e] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {pageNum}
              </button>
            )
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-2 py-1.5 text-gray-500 hover:bg-gray-50 border-x border-gray-200 disabled:opacity-50"
          >
            ›
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="px-2 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            »
          </button>
        </div>
        <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(Number(val))}>
          <SelectTrigger className="w-[110px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} / trang
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
