import React from 'react'
import { Plus, Search, Filter, Eye, Pencil, Trash2, Building2 } from 'lucide-react'
import { StatusToggle } from './StatusToggle'

export function RoomTable({
  rooms,
  loading,
  search,
  setSearch,
  page,
  setPage,
  pageSize,
  filtered,
  paged,
  totalPages,
  setModal,
  setDeleteTarget,
  handleToggle,
  togglingId,
}) {
  return (
    <div className="flex-1 overflow-auto p-6 bg-gray-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <h2 className="font-semibold text-gray-700">
            Danh sách phòng họp
            {!loading && (
              <span className="ml-2 text-xs text-gray-400 font-normal">
                ({filtered.length} phòng)
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên phòng họp..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] w-64"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
              <Filter size={13} />
              Bộ lọc
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-10 px-4 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">
                  STT
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tên phòng họp
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Đơn vị
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3" colSpan={6}>
                      <div className="h-5 bg-gray-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <Building2 size={40} className="opacity-20 mb-3" />
                      <p className="text-sm font-medium">
                        {search ? 'Không tìm thấy phòng họp phù hợp' : 'Chưa có phòng họp nào'}
                      </p>
                      {!search && (
                        <button
                          onClick={() => setModal({ mode: 'add' })}
                          className="mt-3 flex items-center gap-1.5 text-xs text-[#c8102e] hover:underline"
                        >
                          <Plus size={12} />
                          Thêm phòng họp đầu tiên
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((room, idx) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-4 py-3 text-gray-500 tabular-nums">
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 size={13} className="text-[#c8102e]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 leading-tight">{room.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Tạo:{' '}
                            {room.createdAt
                              ? new Date(room.createdAt).toLocaleDateString('vi-VN')
                              : '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{room.departmentName || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusToggle
                        active={room.status === 1}
                        loading={togglingId === room.id}
                        onChange={() => handleToggle(room)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          title="Xem chi tiết"
                          onClick={() => setModal({ mode: 'view', room })}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#c8102e] transition"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          title="Chỉnh sửa"
                          onClick={() => setModal({ mode: 'edit', room })}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          title="Xóa phòng họp"
                          onClick={() => setDeleteTarget(room)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>
              {(page - 1) * pageSize + 1} – {Math.min(page * pageSize, filtered.length)} /{' '}
              {filtered.length} bản ghi
            </span>
            <div className="flex items-center gap-1">
              {[
                { label: '«', fn: () => setPage(1), disabled: page === 1 },
                { label: '‹', fn: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 },
              ].map(({ label, fn, disabled }) => (
                <button
                  key={label}
                  onClick={fn}
                  disabled={disabled}
                  className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {label}
                </button>
              ))}
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
              {[
                {
                  label: '›',
                  fn: () => setPage((p) => Math.min(totalPages, p + 1)),
                  disabled: page === totalPages,
                },
                { label: '»', fn: () => setPage(totalPages), disabled: page === totalPages },
              ].map(({ label, fn, disabled }) => (
                <button
                  key={label}
                  onClick={fn}
                  disabled={disabled}
                  className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {label}
                </button>
              ))}
              <span className="ml-2 text-xs border border-gray-200 rounded px-2 py-1">
                {pageSize} / trang
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
