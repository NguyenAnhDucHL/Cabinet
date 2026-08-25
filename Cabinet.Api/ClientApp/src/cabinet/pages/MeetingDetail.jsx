import React, { useState } from 'react'
import { ArrowLeft, ChevronUp, ChevronDown, Download, FileText, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AccordionSection,
  EmptyState,
  formatDateTime,
  formatTimeOnly,
  getDynamicStatus,
  getStatusColor,
  getRemainingTimeText,
} from '../features/meetings/components/MeetingDetail/MeetingDetailComponents'
import { NotebookModal } from '../features/meetings/components/MeetingDetail/NotebookModal'

export function MeetingDetail({ meeting, onBack, onViewProgress }) {
  const [isNotebookOpen, setIsNotebookOpen] = useState(false)

  if (!meeting) return null

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-[#1a202c]">Thông tin phiên họp</h1>
        </div>
        <button
          className="bg-[#c8102e] hover:bg-[#a50e27] text-white px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors"
          onClick={() => {
            if (onViewProgress) onViewProgress()
          }}
        >
          <ArrowLeft size={16} className="mr-2 rotate-180" /> Xem diễn biến
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 relative">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8 relative">
            <h2 className="text-xl md:text-2xl font-bold text-[#1a202c] leading-snug uppercase mb-4 px-12">
              {meeting.title || 'KHÔNG CÓ TIÊU ĐỀ'}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                Thời gian: {formatDateTime(meeting.startTime)} - {formatTimeOnly(meeting.endTime)}
              </span>
              <span className="flex items-center gap-2">
                Phòng họp: {meeting.roomName || meeting.location || 'Chưa cập nhật'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <AccordionSection title="Thông tin chi tiết phiên họp" defaultOpen={true}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-[140px] shrink-0">Chủ trì:</span>
                  <span className="font-semibold text-gray-900">
                    {meeting.presider || 'Chưa cập nhật'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-[140px] shrink-0">Thời gian còn lại:</span>
                  <span className="font-semibold text-gray-900">
                    {getRemainingTimeText(meeting)}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-[140px] shrink-0">Địa điểm họp:</span>
                  <span className="font-semibold text-[#c8102e]">
                    {meeting.roomName || meeting.location || 'Chưa cập nhật'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-[140px] shrink-0">Thành phần tham gia:</span>
                  <button className="font-semibold text-[#c8102e] hover:underline">
                    Xem thành phần tham gia
                  </button>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-[140px] shrink-0">Giấy mời họp:</span>
                  <a
                    href="#"
                    className="font-semibold text-[#c8102e] hover:underline truncate max-w-[250px]"
                  >
                    A49.50.01-VBNB_2026-GM-0197-2026_dak...
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-[140px] shrink-0">Chương trình họp:</span>
                  <span className="font-semibold text-gray-900">-</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-[140px] shrink-0">Phiếu mời:</span>
                  <span className="font-semibold text-gray-900">-</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-[140px] shrink-0">Trạng thái phiên họp:</span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getStatusColor(getDynamicStatus(meeting))}`}
                  >
                    {getDynamicStatus(meeting)}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-[140px] shrink-0">Kết luận phiên họp:</span>
                  <span className="font-semibold text-gray-900">-</span>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Nội dung họp" count={1} defaultOpen={true}>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h4 className="text-[15px] font-bold text-[#1a202c] leading-snug flex-1">
                      {meeting.content || meeting.title || 'Chưa cập nhật nội dung'}
                    </h4>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button className="bg-[#c8102e] hover:bg-[#a50e27] text-white h-8 text-xs font-semibold px-4 rounded-md">
                        Thêm góp ý
                      </Button>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-50">
                        <ChevronUp size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-[13px] mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-[130px]">Người chuẩn bị tài liệu:</span>
                      <span className="font-semibold text-gray-900">
                        {meeting.preparingUnit || '-'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-[130px]">Thời gian:</span>
                      <span className="font-semibold text-gray-900">
                        {formatDateTime(meeting.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-[130px]">Người duyệt tài liệu:</span>
                      <span className="font-semibold text-gray-900">-</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-[130px]">Kết luận nội dung họp:</span>
                      <span className="font-semibold text-gray-900">-</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-[130px]">Thành phần tham gia:</span>
                      <button className="font-semibold text-[#c8102e] hover:underline">
                        Xem thành phần tham gia
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-[130px]">Trạng thái:</span>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getStatusColor(getDynamicStatus(meeting))}`}
                      >
                        {getDynamicStatus(meeting)}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h5 className="text-[13px] font-bold text-[#1a202c] mb-2">
                      Danh sách tài liệu:
                    </h5>
                    {meeting.documents && meeting.documents.length > 0 ? (
                      <ul className="space-y-2">
                        {meeting.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-[13px]">
                            <FileText size={16} className="text-red-500 shrink-0" />
                            <span className="font-medium text-[#1a202c] truncate">
                              {idx + 1}. {doc.name || 'Tài liệu'}
                            </span>
                            <button className="text-gray-400 hover:text-[#c8102e] ml-1">
                              <Download size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-[13px] text-gray-500 italic">Chưa có tài liệu</div>
                    )}
                  </div>
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50">
                    <span className="text-[13px] font-bold text-[#1a202c]">Danh sách ghi âm</span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Danh sách vấn đề cần biểu quyết" count={0}>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-[13px] text-[#1a202c] font-bold bg-white border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-center w-16">STT</th>
                      <th className="px-4 py-3">Nội dung</th>
                      <th className="px-4 py-3 w-1/4">Vấn đề</th>
                      <th className="px-4 py-3 text-center w-32">Trạng thái</th>
                      <th className="px-4 py-3 text-center w-24">Hành động</th>
                    </tr>
                  </thead>
                </table>
                <EmptyState />
              </div>
            </AccordionSection>

            <AccordionSection
              title="Danh sách đăng ký phát biểu"
              count={0}
              rightAction={
                <button className="text-gray-400 hover:text-gray-600 font-medium text-xl leading-none ml-2">
                  +
                </button>
              }
            >
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button className="flex-1 py-3 text-center font-bold text-sm text-[#c8102e] border-b-2 border-[#c8102e] bg-white">
                    Chờ phát biểu
                  </button>
                  <button className="flex-1 py-3 text-center font-bold text-sm text-gray-600 hover:bg-gray-50">
                    Bác bỏ
                  </button>
                </div>
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-[13px] text-[#1a202c] font-bold bg-white border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-center w-12">STT</th>
                      <th className="px-4 py-3">Tên đại biểu</th>
                      <th className="px-4 py-3">Chức vụ</th>
                      <th className="px-4 py-3">Nội dung đăng ký</th>
                      <th className="px-4 py-3">Ghi chú</th>
                      <th className="px-4 py-3">Thời gian bắt đầu phát biểu</th>
                      <th className="px-4 py-3 text-center">Trạng thái</th>
                      <th className="px-4 py-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                </table>
                <EmptyState />
              </div>
            </AccordionSection>

            <AccordionSection title="Danh sách tham gia góp ý (0) (Người góp ý: 0/14)">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-[13px] text-[#1a202c] font-bold bg-white border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-center w-16">STT</th>
                      <th className="px-4 py-3">Tên đại biểu</th>
                      <th className="px-4 py-3 w-1/5">Chức vụ</th>
                      <th className="px-4 py-3 w-1/4">Góp ý cho nội dung</th>
                      <th className="px-4 py-3 w-1/5">Chi tiết góp ý</th>
                      <th className="px-4 py-3 text-center w-24">Hành động</th>
                    </tr>
                  </thead>
                </table>
                <EmptyState />
              </div>
            </AccordionSection>
          </div>
        </div>
      </div>

      <div className="fixed right-0 top-[40%] z-40 flex items-center group cursor-pointer transition-transform translate-x-[calc(100%-3rem)] hover:translate-x-0">
        <button
          onClick={() => setIsNotebookOpen(true)}
          className="bg-white border-y border-l border-[#c8102e] rounded-l-full flex items-center shadow-md overflow-hidden h-12"
        >
          <div className="bg-[#c8102e] text-white w-9 h-9 flex items-center justify-center rounded-md ml-1.5 shrink-0">
            <Book size={18} />
          </div>
          <span className="text-[#c8102e] font-bold px-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Sổ tay
          </span>
        </button>
      </div>

      <NotebookModal isOpen={isNotebookOpen} setIsOpen={setIsNotebookOpen} meeting={meeting} />
    </div>
  )
}
