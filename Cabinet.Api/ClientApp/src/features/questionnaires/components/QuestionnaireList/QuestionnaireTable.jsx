import React, { useState } from 'react'
import { FileText, ChevronRight, Search, Filter, Send } from 'lucide-react'
import { STATUS_BADGE } from '../../constants/questionnaire'
import { questionnaireApi } from '../../api/questionnaireApi'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

export function QuestionnaireTable({
  loading,
  paged,
  search,
  setSearch,
  page,
  setPage,
  pageSize,
  filteredLength,
  totalPages,
  activeTab,
  onRefresh,
}) {
  const [sendingId, setSendingId] = useState(null)
  const [sendConfirmId, setSendConfirmId] = useState(null)
  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Table controls */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-gray-700">Danh sách phiếu lấy ý kiến</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên phiếu..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] w-60"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
            <Filter size={13} />
            Bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">
                STT
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tên phiếu
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Chuyên viên phụ trách
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Hạn trả lời
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái phiếu
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4" colSpan={6}>
                    <div className="h-4 bg-gray-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-20 text-center">
                  <div className="flex flex-col items-center text-gray-400">
                    <div className="w-20 h-20 mb-3 relative">
                      <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                        <FileText size={32} className="opacity-20" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-400">?</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium">Không có dữ liệu</p>
                    <p className="text-xs mt-1 text-gray-300">
                      {search
                        ? 'Không tìm thấy phiếu phù hợp'
                        : 'Chưa có phiếu lấy ý kiến nào trong mục này'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((q, idx) => {
                const badge = STATUS_BADGE[activeTab] || STATUS_BADGE.pending
                const Icon = badge.icon
                return (
                  <tr key={q.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-5 py-3 text-gray-500">{(page - 1) * pageSize + idx + 1}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{q.title}</p>
                      {q.description && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">{q.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {q.assignedTo || q.createdByName || '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {q.deadline ? new Date(q.deadline).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${badge.class}`}
                      >
                        <Icon size={11} />
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!q.sentAt && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSendConfirmId(q.id)
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1 transition"
                          >
                            <Send size={11} /> Gửi
                          </button>
                        )}
                        <button className="text-xs text-[#c8102e] hover:underline flex items-center gap-0.5">
                          Chi tiết <ChevronRight size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Send Confirmation Modal */}
      <ConfirmationModal
        open={!!sendConfirmId}
        onOpenChange={(open) => !open && setSendConfirmId(null)}
        title="Gửi Phữu lấy ý kiến"
        description="Sau khi gửi, phiếu sẽ được gửi đến toàn bộ thành viên và không thể xóa. Bạn có chắc chắn muốn gửi không?"
        onConfirm={async () => {
          if (!sendConfirmId) return
          setSendingId(sendConfirmId)
          setSendConfirmId(null)
          try {
            const res = await questionnaireApi.send(sendConfirmId)
            if (res.success) {
              alert(res.message || 'Đã gửi phiếu lấy ý kiến thành công.')
              if (onRefresh) onRefresh()
            } else {
              alert(res.message || 'Không thể gửi phiếu.')
            }
          } catch {
            alert('Lỗi kết nối máy chủ.')
          } finally {
            setSendingId(null)
          }
        }}
      />
      {/* Pagination */}
      {!loading && filteredLength > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            {(page - 1) * pageSize + 1} – {Math.min(page * pageSize, filteredLength)} /{' '}
            {filteredLength} bản ghi
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"
            >
              «
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded flex items-center justify-center font-medium transition ${
                  page === p ? 'bg-[#c8102e] text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"
            >
              ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"
            >
              »
            </button>
            <span className="ml-2 text-xs border border-gray-200 rounded px-2 py-1">
              {pageSize} / trang
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
