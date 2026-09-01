import React, { useState, useRef } from 'react'
import {
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  CheckCircle2,
  Circle,
  AlertCircle,
  X,
  Download,
  Book,
  Send,
  UserX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { meetingApi } from '../../features/meetings/api/meetingApi'
import {
  AccordionSection,
  EmptyState,
  formatDateTime,
  formatTimeOnly,
  getDynamicStatus,
  getStatusColor,
  getRemainingTimeText,
} from '../../features/meetings/components/MeetingDetail/MeetingDetailComponents'
import { NotebookModal } from '../../features/meetings/components/MeetingDetail/NotebookModal'

export function MeetingDetail({ meeting, onBack, onViewProgress }) {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false)
  const [isSendingInvitation, setIsSendingInvitation] = useState(false)
  const [invitationSent, setInvitationSent] = useState(!!meeting?.invitationSentAt)
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false)
  const [absenceReason, setAbsenceReason] = useState('')
  const [absenceSaving, setAbsenceSaving] = useState(false)

  // Parse file paths safely
  const parseFiles = (jsonString) => {
    try {
      if (!jsonString || jsonString === 'null') return []
      return JSON.parse(jsonString)
    } catch {
      return []
    }
  }

  const programFiles = parseFiles(meeting.programFilePaths)
  const invitationFiles = parseFiles(meeting.invitationFilePaths)

  const [isGopYOpen, setIsGopYOpen] = useState(false)
  const [gopYContent, setGopYContent] = useState('')
  const [gopYDetail, setGopYDetail] = useState('')
  const [gopYDoc, setGopYDoc] = useState('')
  const [gopYFiles, setGopYFiles] = useState([])
  const [gopYSaving, setGopYSaving] = useState(false)
  const gopYFileRef = useRef(null)

  const handleGopYSubmit = async () => {
    if (!gopYDetail.trim()) return
    setGopYSaving(true)

    try {
      const formData = new FormData()
      formData.append('detail', gopYDetail)
      if (gopYContent) formData.append('contentRef', gopYContent)
      if (gopYDoc) formData.append('documentRef', gopYDoc)

      gopYFiles.forEach((file) => {
        formData.append('attachments', file)
      })

      const response = await fetch(`/api/phonghopkhonggiayto/meetings/${meeting.id}/feedbacks`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (response.ok) {
        setIsGopYOpen(false)
        setGopYDetail('')
        setGopYContent('')
        setGopYDoc('')
        setGopYFiles([])
        alert(data.message || 'Góp ý đã được ghi nhận thành công.')
      } else {
        alert(data.message || 'Lỗi khi gửi góp ý')
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi kết nối máy chủ')
    } finally {
      setGopYSaving(false)
    }
  }

  if (!meeting) return null

  return (
    <>
      <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-[#1a202c]">Thông tin phiên họp</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="border border-amber-500 text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors"
              onClick={() => setIsAbsenceModalOpen(true)}
            >
              <UserX size={15} className="mr-1.5" /> Báo vắng
            </button>
            <button
              className={`px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors ${
                invitationSent
                  ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              disabled={isSendingInvitation || invitationSent}
              onClick={async () => {
                if (invitationSent) return
                setIsSendingInvitation(true)
                try {
                  const res = await meetingApi.sendInvitation(meeting.id)
                  if (res.success) {
                    setInvitationSent(true)
                    alert(res.message || 'Đã gửi lịch họp thành công!')
                  } else {
                    alert(res.message || 'Có lỗi khi gửi lịch họp.')
                  }
                } catch {
                  alert('Không thể kết nối máy chủ.')
                } finally {
                  setIsSendingInvitation(false)
                }
              }}
            >
              <Send size={15} className="mr-1.5" />
              {invitationSent
                ? 'Đã gửi lịch họp'
                : isSendingInvitation
                  ? 'Đang gửi...'
                  : 'Gửi lịch họp'}
            </button>
            <button
              className="border border-green-600 text-green-700 hover:bg-green-50 px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors"
              onClick={async () => {
                try {
                  const blob = await meetingApi.export(meeting.id)
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `BaoCao_PhienHop_${meeting.id}.xls`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  window.URL.revokeObjectURL(url)
                } catch (e) {
                  alert(e.message || 'Có lỗi khi xuất báo cáo')
                }
              }}
            >
              <Download size={15} className="mr-1.5" /> Xuất báo cáo
            </button>
            <button
              className="bg-[#c8102e] hover:bg-[#a50e27] text-white px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors"
              onClick={() => {
                if (onViewProgress) onViewProgress()
              }}
            >
              <ArrowLeft size={16} className="mr-2 rotate-180" /> Xem diễn biến
            </button>
          </div>
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
                    <button
                      onClick={() => setIsParticipantsModalOpen(true)}
                      className="font-semibold text-[#c8102e] hover:underline"
                    >
                      Xem thành phần tham gia
                    </button>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 w-[140px] shrink-0">Giấy mời họp:</span>
                    <div className="flex flex-col gap-1">
                      {invitationFiles.length > 0 ? (
                        invitationFiles.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 group">
                            <a
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#c8102e] hover:underline truncate max-w-[250px]"
                            >
                              {file.split('/').pop()}
                            </a>
                            <a
                              href={file}
                              download
                              className="text-gray-400 hover:text-[#c8102e] transition-colors"
                              title="Tải xuống"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ))
                      ) : (
                        <span className="font-semibold text-gray-900">-</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 w-[140px] shrink-0">Tài liệu họp:</span>
                    <div className="flex flex-col gap-1">
                      {programFiles.length > 0 ? (
                        programFiles.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 group">
                            <a
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#c8102e] hover:underline truncate max-w-[250px]"
                            >
                              {file.split('/').pop()}
                            </a>
                            <a
                              href={file}
                              download
                              className="text-gray-400 hover:text-[#c8102e] transition-colors"
                              title="Tải xuống"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ))
                      ) : (
                        <span className="font-semibold text-gray-900">-</span>
                      )}
                    </div>
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
                        <Button
                          className="bg-[#c8102e] hover:bg-[#a50e27] text-white h-8 text-xs font-semibold px-4 rounded-md"
                          onClick={() => setIsGopYOpen(true)}
                        >
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
                        <button
                          onClick={() => setIsParticipantsModalOpen(true)}
                          className="font-semibold text-[#c8102e] hover:underline"
                        >
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
            onClick={() => setIsNoteModalOpen(true)}
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

        <NotebookModal isOpen={isNoteModalOpen} setIsOpen={setIsNoteModalOpen} meeting={meeting} />

        {/* Modal Thêm góp ý */}
        {isGopYOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsGopYOpen(false)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Thêm mới góp ý</h2>
                <button
                  onClick={() => setIsGopYOpen(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                {/* Góp ý cho nội dung */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Góp ý cho nội dung <span className="text-[#c8102e]">*</span>
                  </label>
                  <select
                    value={gopYContent}
                    onChange={(e) => setGopYContent(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/25 focus:border-[#c8102e] transition bg-white"
                  >
                    <option value="">-- Chọn nội dung --</option>
                    <option value={meeting.content || meeting.title}>
                      {meeting.content || meeting.title || 'Nội dung họp'}
                    </option>
                  </select>
                </div>

                {/* Tài liệu cần góp ý */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tài liệu cần góp ý
                  </label>
                  <select
                    value={gopYDoc}
                    onChange={(e) => setGopYDoc(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/25 focus:border-[#c8102e] transition bg-white"
                  >
                    <option value="">Chọn tài liệu</option>
                    {(meeting.documents || []).map((doc, idx) => (
                      <option key={idx} value={doc.name || doc}>
                        {doc.name || doc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chi tiết góp ý */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Chi tiết góp ý <span className="text-[#c8102e]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Nhập nội dung góp ý"
                    value={gopYDetail}
                    onChange={(e) => setGopYDetail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/25 focus:border-[#c8102e] transition resize-none"
                  />
                </div>

                {/* Tài liệu đính kèm */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tài liệu đính kèm
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-5 text-center cursor-pointer hover:border-[#c8102e] hover:bg-red-50/30 transition"
                    onClick={() => gopYFileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const files = Array.from(e.dataTransfer.files)
                      setGopYFiles((prev) => [...prev, ...files])
                    }}
                  >
                    <Upload size={20} className="mx-auto text-[#c8102e] mb-1" />
                    <p className="text-sm">
                      <span className="text-[#c8102e] font-semibold">Chọn file</span>
                      <span className="text-gray-500"> hoặc Kéo thả từ máy tính</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tối đa 50MB, định dạng .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf
                    </p>
                  </div>
                  <input
                    ref={gopYFileRef}
                    type="file"
                    multiple
                    accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files)
                        setGopYFiles((prev) => [...prev, ...Array.from(e.target.files)])
                    }}
                  />
                  {gopYFiles.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {gopYFiles.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded"
                        >
                          <span className="truncate">{f.name}</span>
                          <button
                            onClick={() =>
                              setGopYFiles((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="text-gray-400 hover:text-red-500 ml-2 shrink-0"
                          >
                            <X size={13} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => setIsGopYOpen(false)}
                  className="px-5 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleGopYSubmit}
                  disabled={gopYSaving || !gopYDetail.trim()}
                  className="px-5 py-2 text-sm bg-[#c8102e] hover:bg-[#a50e27] text-white rounded-lg font-semibold transition disabled:opacity-60"
                >
                  {gopYSaving ? 'Đang gửi...' : 'Góp ý'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {renderAbsenceModal()}
    </>
  )

  // Modal Báo vắng appended inline
  function renderAbsenceModal() {
    if (!isAbsenceModalOpen) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <UserX size={20} className="text-amber-500" /> Báo vắng
            </h2>
            <button
              onClick={() => setIsAbsenceModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-gray-600">
              Vui lòng nhập lý do vắng mặt cho phiên họp{' '}
              <span className="font-semibold text-gray-900">{meeting.title}</span>.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do vắng mặt <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none resize-none"
                rows={3}
                placeholder="Nhập lý do vắng mặt..."
                value={absenceReason}
                onChange={(e) => setAbsenceReason(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button
              onClick={() => setIsAbsenceModalOpen(false)}
              className="px-5 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              Hủy bỏ
            </button>
            <button
              disabled={absenceSaving || !absenceReason.trim()}
              onClick={async () => {
                setAbsenceSaving(true)
                try {
                  const res = await meetingApi.reportAbsence(meeting.id, absenceReason, null)
                  if (res.success) {
                    setIsAbsenceModalOpen(false)
                    setAbsenceReason('')
                    alert(res.message || 'Đã gửi báo cáo vắng mặt.')
                  } else {
                    alert(res.message || 'Không thể gửi báo cáo.')
                  }
                } catch {
                  alert('Không thể kết nối máy chủ.')
                } finally {
                  setAbsenceSaving(false)
                }
              }}
              className="px-5 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition disabled:opacity-60"
            >
              {absenceSaving ? 'Đang gửi...' : 'Gửi báo cáo vắng'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}
