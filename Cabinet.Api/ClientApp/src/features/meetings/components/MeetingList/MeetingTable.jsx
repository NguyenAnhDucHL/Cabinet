import React, { useState } from 'react'
import { Eye, MoreVertical, CheckCircle2, FolderPlus, Trash2, Inbox } from 'lucide-react'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ATTENDANCE_STATUS } from '../../../../constants/meeting'

const getStatusBadge = (status) => {
  switch (status) {
    case ATTENDANCE_STATUS.JOINED:
    case ATTENDANCE_STATUS.PROCESSED:
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full text-xs">
          Tham gia
        </span>
      )
    case ATTENDANCE_STATUS.PENDING:
    case ATTENDANCE_STATUS.UNPROCESSED:
      return (
        <span className="px-3 py-1 bg-orange-100 text-orange-700 font-semibold rounded-full text-xs">
          Chưa xác nhận
        </span>
      )
    case ATTENDANCE_STATUS.ABSENT:
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-full text-xs">
          Vắng mặt
        </span>
      )
    default:
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full text-xs">
          Tham gia
        </span>
      )
  }
}

export function MeetingTable({
  loading,
  paginatedMeetings,
  currentPage,
  pageSize,
  activeTab,
  isAdmin,
  setSelectedMeeting,
  deleteMeeting,
}) {
  const [deletingMeetingId, setDeletingMeetingId] = useState(null)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-center border-r border-gray-200">STT</th>
            <th className="px-4 py-3 text-center border-r border-gray-200 whitespace-nowrap">
              Thời gian họp
            </th>
            <th className="px-4 py-3 border-r border-gray-200">Tên phiên họp</th>
            <th className="px-4 py-3 border-r border-gray-200">Địa điểm họp</th>
            <th className="px-4 py-3 border-r border-gray-200">Chủ trì cuộc họp</th>
            <th className="px-4 py-3 text-center border-r border-gray-200">
              {activeTab === 'invited' ? 'Trạng thái tham gia' : 'Trạng thái'}
            </th>
            <th className="px-4 py-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : paginatedMeetings.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-4 py-16 text-center text-gray-400 bg-gray-50/50">
                <div className="flex flex-col items-center justify-center">
                  <Inbox size={48} className="mb-4 opacity-30" />
                  <p className="text-base font-semibold text-gray-500 mb-1">Không có dữ liệu</p>
                </div>
              </td>
            </tr>
          ) : (
            paginatedMeetings.map((m, index) => {
              const stt = (currentPage - 1) * pageSize + index + 1
              const s = new Date(m.startTime)
              const e = new Date(m.endTime)
              const dateStr = `${s.getDate().toString().padStart(2, '0')}/${(s.getMonth() + 1).toString().padStart(2, '0')}/${s.getFullYear()}`
              const timeStr = `${s.getHours().toString().padStart(2, '0')}:${s.getMinutes().toString().padStart(2, '0')} - ${e.getHours().toString().padStart(2, '0')}:${e.getMinutes().toString().padStart(2, '0')}`
              return (
                <tr
                  key={m.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-center font-medium">{stt}</td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{dateStr}</div>
                    <div className="text-xs text-gray-500">{timeStr}</div>
                  </td>
                  <td
                    className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate"
                    title={m.title}
                  >
                    {m.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.roomName}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {m.presider || 'Chưa xác định'}
                  </td>
                  <td className="px-4 py-3 text-center">{getStatusBadge(m.attendanceStatus)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedMeeting(m)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition"
                      >
                        <Eye size={16} />
                      </button>
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition outline-none">
                                <MoreVertical size={16} />
                              </button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-black text-white text-xs px-2 py-1 border-black font-medium"
                          >
                            Thao tác khác
                          </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent
                          align="end"
                          className="w-56 rounded-xl shadow-lg border-gray-100 p-1"
                        >
                          <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1a202c] py-2 outline-none">
                            <CheckCircle2 size={16} />
                            <span>Xác nhận tham gia</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1a202c] py-2 outline-none">
                            <FolderPlus size={16} />
                            <span>Thêm tài liệu vào thư viện</span>
                          </DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 py-2 outline-none"
                              onClick={() => setDeletingMeetingId(m.id)}
                            >
                              <Trash2 size={16} />
                              <span>Xóa phiên họp</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
      <ConfirmationModal
        open={!!deletingMeetingId}
        onOpenChange={(open) => !open && setDeletingMeetingId(null)}
        title="Xóa phiên họp"
        description="Bạn có chắc chắn muốn xóa phiên họp này không? Hành động này không thể hoàn tác."
        onConfirm={() => {
          deleteMeeting(deletingMeetingId)
          setDeletingMeetingId(null)
        }}
      />
    </div>
  )
}
