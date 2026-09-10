/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  UserCheck,
  FileText,
  StickyNote,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  Trash2,
  Upload,
} from 'lucide-react'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

// Format datetime-local value
function toDatetimeLocal(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function MeetingModal({ meeting, onClose, onSaved }) {
  const isEdit = !!meeting
  const [rooms, setRooms] = useState([])
  const [users, setUsers] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState('basic')
  const [searchQuery, setSearchQuery] = useState('')
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [programFiles, setProgramFiles] = useState([])
  const [invitationFiles, setInvitationFiles] = useState([])
  const [existingProgramFiles, setExistingProgramFiles] = useState(() => {
    try {
      return meeting?.programFilePaths ? JSON.parse(meeting.programFilePaths) : []
    } catch {
      return []
    }
  })
  const [existingInvitationFiles, setExistingInvitationFiles] = useState(() => {
    try {
      return meeting?.invitationFilePaths ? JSON.parse(meeting.invitationFilePaths) : []
    } catch {
      return []
    }
  })
  const programFileRef = useRef(null)
  const invitationFileRef = useRef(null)

  const [form, setForm] = useState({
    title: meeting?.title || '',
    startTime: meeting?.startTime ? toDatetimeLocal(meeting.startTime) : '',
    endTime: meeting?.endTime ? toDatetimeLocal(meeting.endTime) : '',
    roomId: meeting?.roomId ? meeting.roomId : meeting?.location ? 'other' : '',
    location: meeting?.location || '',
    presider: meeting?.presider || '',
    preparingUnit: meeting?.preparingUnit || '',
    content: meeting?.content || '',
    notes: meeting?.notes || '',
    organizingUnit: meeting?.organizingUnit || '',
    expectedAttendees: meeting?.expectedAttendees || 0,
    externalParticipants: meeting?.externalParticipants || '',
    participantUserIds: meeting?.participants?.map((p) => p.userId) || [],
  })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  useEffect(() => {
    setLoadingOptions(true)
    Promise.all([
      fetch('/api/phonghopkhonggiayto/rooms')
        .then((r) => r.json())
        .then((j) => setRooms(Array.isArray(j) ? j : j.data || [])),
      fetch('/api/users')
        .then((r) => r.json())
        .then((j) => setUsers(Array.isArray(j) ? j : j.data || [])),
    ])
      .catch(() => {})
      .finally(() => setLoadingOptions(false))
  }, [])

  const toggleParticipant = (userId) => {
    setForm((f) => ({
      ...f,
      participantUserIds: f.participantUserIds.includes(userId)
        ? f.participantUserIds.filter((id) => id !== userId)
        : [...f.participantUserIds, userId],
    }))
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')

    try {
      const res = await fetch(`/api/phonghopkhonggiayto/meetings/${meeting.id}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!res.ok || json.success === false) {
        setError(json.message || 'Không thể xóa phiên họp.')
        setDeleting(false)
        setShowConfirmDelete(false)
        return
      }
      setShowConfirmDelete(false)
      onSaved(null, 'deleted')
    } catch {
      setError('Không thể kết nối đến máy chủ.')
      setDeleting(false)
      setShowConfirmDelete(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Tên phiên họp không được để trống.')
      return
    }
    if (!form.startTime) {
      setError('Vui lòng chọn thời gian bắt đầu.')
      return
    }
    if (!form.endTime) {
      setError('Vui lòng chọn thời gian kết thúc.')
      return
    }
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError('Thời gian kết thúc phải sau thời gian bắt đầu.')
      return
    }
    if (!form.roomId) {
      setError('Vui lòng chọn phòng họp.')
      return
    }
    if (form.roomId === 'other' && !form.location.trim()) {
      setError('Vui lòng nhập địa điểm phòng họp khác.')
      return
    }

    setSaving(true)
    setError('')

    const body = {
      title: form.title.trim(),
      startTime: form.startTime.length === 16 ? form.startTime + ':00' : form.startTime,
      endTime: form.endTime.length === 16 ? form.endTime + ':00' : form.endTime,
      roomId: form.roomId === 'other' ? null : parseInt(form.roomId),
      location: form.location.trim() || null,
      presider: form.presider.trim() || null,
      preparingUnit: form.preparingUnit.trim() || null,
      content: form.content.trim() || null,
      notes: form.notes.trim() || null,
      organizingUnit: form.organizingUnit.trim() || null,
      expectedAttendees: parseInt(form.expectedAttendees) || 0,
      externalParticipants: form.externalParticipants.trim() || null,
      participantUserIds: form.participantUserIds,
      programFilePaths: existingProgramFiles,
      invitationFilePaths: existingInvitationFiles,
    }

    const url = isEdit
      ? `/api/phonghopkhonggiayto/meetings/${meeting.id}`
      : '/api/phonghopkhonggiayto/meetings'
    const method = isEdit ? 'PUT' : 'POST'

    const fd = new FormData()
    fd.append('requestJson', JSON.stringify(body))

    programFiles.forEach((f) => fd.append('programFiles', f))
    invitationFiles.forEach((f) => fd.append('invitationFiles', f))

    try {
      const res = await fetch(url, { method, body: fd })
      if (res.status === 413) {
        setError('Tổng dung lượng file tải lên quá lớn, máy chủ đã từ chối (Lỗi 413).')
        return
      }

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        setError(`Lỗi hệ thống (${res.status}): Máy chủ phản hồi sai định dạng (có thể do Nginx chặn).`)
        return
      }

      const json = await res.json()
      if (!res.ok || json.success === false) {
        setError(json.message || 'Có lỗi xảy ra, vui lòng thử lại.')
        return
      }
      onSaved(json.data, isEdit ? 'updated' : 'created')
    } catch {
      setError('Không thể kết nối đến máy chủ.')
    } finally {
      setSaving(false)
    }
  }

  const SECTIONS = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: Calendar },
    { id: 'detail', label: 'Nội dung họp', icon: FileText },
    { id: 'participants', label: 'Danh sách tham dự', icon: Users },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--color-primary)] shrink-0">
          <div className="flex items-center gap-2 text-white">
            <Calendar size={18} />
            <h2 className="font-bold text-base">
              {isEdit ? 'Chỉnh sửa phiên họp' : 'Tạo phiên họp mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-gray-200 shrink-0 bg-gray-50">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === s.id
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <s.icon size={13} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Body — scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* ── SECTION: Thông tin cơ bản ── */}
            {activeSection === 'basic' && (
              <div className="space-y-4">
                {/* Tên phiên họp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tên phiên họp / Nội dung <span className="text-[var(--color-primary)]">*</span>
                  </label>
                  <textarea
                    value={form.title}
                    onChange={set('title')}
                    rows={2}
                    placeholder="VD: Họp về kiểm đếm tiến độ Đề án ứng dụng CNTT trong đảm bảo ANTT, VSMT"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition resize-none"
                    autoFocus
                  />
                </div>

                {/* Thời gian */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <Clock size={13} className="inline mr-1" />
                      Bắt đầu <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={form.startTime}
                      onChange={set('startTime')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <Clock size={13} className="inline mr-1" />
                      Kết thúc <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={form.endTime}
                      onChange={set('endTime')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition"
                    />
                  </div>
                </div>

                {/* Phòng họp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Building2 size={13} className="inline mr-1" />
                    Phòng họp <span className="text-[var(--color-primary)]">*</span>
                  </label>
                  {loadingOptions ? (
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                  ) : (
                    <select
                      value={form.roomId}
                      onChange={set('roomId')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition bg-white"
                    >
                      <option value="">-- Chọn phòng họp --</option>
                      {rooms
                        .filter((r) => r.status === 1)
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      <option value="other">Phòng họp khác</option>
                    </select>
                  )}
                </div>

                {/* Phòng họp khác / Địa điểm chi tiết */}
                {form.roomId === 'other' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <MapPin size={13} className="inline mr-1" />
                      Tên/Địa điểm phòng họp khác{' '}
                      <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <textarea
                      value={form.location}
                      onChange={set('location')}
                      placeholder="VD: Tại Hội trường Huyện ủy..."
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition"
                    />
                  </div>
                )}

                {/* Đơn vị tổ chức */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Đơn vị tổ chức
                  </label>
                  <input
                    type="text"
                    value={form.organizingUnit}
                    onChange={set('organizingUnit')}
                    placeholder="VD: Văn phòng HĐND - UBND phường"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition"
                  />
                </div>
              </div>
            )}

            {/* ── SECTION: Nội dung họp ── */}
            {activeSection === 'detail' && (
              <div className="space-y-4">
                {/* Người chủ trì */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <UserCheck size={13} className="inline mr-1" />
                    Người chủ trì
                  </label>
                  <input
                    type="text"
                    value={form.presider}
                    onChange={set('presider')}
                    placeholder="VD: Đ/c Hoàng Việt Dũng - Phó Bí thư Đảng uỷ, Chủ tịch UBND phường (chủ trì)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition"
                  />
                </div>

                {/* Đơn vị chuẩn bị tài liệu */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Đơn vị chuẩn bị tài liệu
                  </label>
                  <input
                    type="text"
                    value={form.preparingUnit}
                    onChange={set('preparingUnit')}
                    placeholder="VD: Phòng VH-XH chuẩn bị tài liệu"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition"
                  />
                </div>

                {/* Số lượng đại biểu */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Số lượng đại biểu dự kiến
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.expectedAttendees}
                    onChange={set('expectedAttendees')}
                    className="w-40 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition"
                  />
                </div>

                {/* Nội dung chương trình họp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <FileText size={13} className="inline mr-1" />
                    Nội dung / Chương trình họp
                  </label>
                  <textarea
                    value={form.content}
                    onChange={set('content')}
                    rows={5}
                    placeholder="Nhập nội dung chương trình cuộc họp, các điểm thảo luận..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition resize-none"
                  />
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <StickyNote size={13} className="inline mr-1" />
                    Ghi chú thêm
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={set('notes')}
                    rows={3}
                    placeholder="Các ghi chú, yêu cầu đặc biệt cho phiên họp..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition resize-none"
                  />
                </div>

                {/* Tài liệu họp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tài liệu họp
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-5 text-center cursor-pointer hover:border-[var(--color-primary)] hover:bg-red-50/30 transition"
                    onClick={() => programFileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (e.dataTransfer.files) {
                        setProgramFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
                      }
                    }}
                  >
                    <Upload size={20} className="mx-auto text-[var(--color-primary)] mb-1" />
                    <p className="text-sm">
                      <span className="text-[var(--color-primary)] font-semibold">Chọn file</span>
                      <span className="text-gray-500"> hoặc Kéo thả từ máy tính</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Hỗ trợ định dạng: .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf
                    </p>
                  </div>
                  <input
                    ref={programFileRef}
                    type="file"
                    multiple
                    accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files)
                        setProgramFiles((prev) => [...prev, ...Array.from(e.target.files)])
                    }}
                  />
                  {(existingProgramFiles.length > 0 || programFiles.length > 0) && (
                    <ul className="mt-2 space-y-1">
                      {existingProgramFiles.map((path, i) => (
                        <li
                          key={`exist-${i}`}
                          className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded"
                        >
                          <span className="truncate font-medium">{path.split('/').pop()}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setExistingProgramFiles((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="text-gray-400 hover:text-red-500 ml-2 shrink-0"
                          >
                            <X size={13} />
                          </button>
                        </li>
                      ))}
                      {programFiles.map((f, i) => (
                        <li
                          key={`new-${i}`}
                          className="flex items-center justify-between text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded"
                        >
                          <span className="truncate font-medium">{f.name} (Mới)</span>
                          <button
                            type="button"
                            onClick={() =>
                              setProgramFiles((prev) => prev.filter((_, idx) => idx !== i))
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

                {/* Giấy mời họp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Giấy mời họp
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-5 text-center cursor-pointer hover:border-[var(--color-primary)] hover:bg-red-50/30 transition"
                    onClick={() => invitationFileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (e.dataTransfer.files) {
                        setInvitationFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
                      }
                    }}
                  >
                    <Upload size={20} className="mx-auto text-[var(--color-primary)] mb-1" />
                    <p className="text-sm">
                      <span className="text-[var(--color-primary)] font-semibold">
                        Chọn file giấy mời
                      </span>
                    </p>
                  </div>
                  <input
                    ref={invitationFileRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files)
                        setInvitationFiles((prev) => [...prev, ...Array.from(e.target.files)])
                    }}
                  />
                  {(existingInvitationFiles.length > 0 || invitationFiles.length > 0) && (
                    <ul className="mt-2 space-y-1">
                      {existingInvitationFiles.map((path, i) => (
                        <li
                          key={`exist-${i}`}
                          className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded"
                        >
                          <span className="truncate font-medium">{path.split('/').pop()}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setExistingInvitationFiles((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                            className="text-gray-400 hover:text-red-500 ml-2 shrink-0"
                          >
                            <X size={13} />
                          </button>
                        </li>
                      ))}
                      {invitationFiles.map((f, i) => (
                        <li
                          key={`new-${i}`}
                          className="flex items-center justify-between text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded"
                        >
                          <span className="truncate font-medium">{f.name} (Mới)</span>
                          <button
                            type="button"
                            onClick={() =>
                              setInvitationFiles((prev) => prev.filter((_, idx) => idx !== i))
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
            )}

            {/* ── SECTION: Danh sách tham dự ── */}
            {activeSection === 'participants' && (
              <div className="flex flex-col h-[400px]">
                {/* Khách mời ngoài cơ quan */}
                <div className="mb-5 shrink-0">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Khách mời ngoài cơ quan
                  </label>
                  <textarea
                    value={form.externalParticipants}
                    onChange={set('externalParticipants')}
                    rows={2}
                    placeholder="VD: Đ/c Nguyễn Văn A (Công an phường); Đ/c Trần Văn B (Ban Chỉ huy Quân sự phường)..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition resize-none"
                  />
                </div>

                <div className="flex items-center justify-between mb-3 shrink-0">
                  <p className="text-sm font-semibold text-gray-700">
                    Chọn thành viên tham dự
                    {form.participantUserIds.length > 0 && (
                      <span className="ml-2 bg-[var(--color-primary)] text-white text-xs px-2 py-0.5 rounded-full">
                        {form.participantUserIds.length} đã chọn
                      </span>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, participantUserIds: [] }))}
                    className="text-xs text-gray-400 hover:text-red-500 transition"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>

                <div className="mb-3 shrink-0">
                  <input
                    type="text"
                    placeholder="Tìm kiếm người tham dự (tên, đơn vị...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition"
                  />
                </div>

                {loadingOptions ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Không có dữ liệu người dùng
                  </p>
                ) : (
                  <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                    {users
                      .filter((u) => {
                        if (!searchQuery) return true
                        const q = searchQuery.toLowerCase()
                        return (
                          (u.fullName || '').toLowerCase().includes(q) ||
                          (u.username || '').toLowerCase().includes(q) ||
                          (u.departmentName || '').toLowerCase().includes(q)
                        )
                      })
                      .map((u) => {
                        const selected = form.participantUserIds.includes(u.id)
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => toggleParticipant(u.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition text-left ${
                              selected
                                ? 'bg-red-50 border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                selected
                                  ? 'bg-[var(--color-primary)] text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {(u.fullName || u.username || '?')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {u.fullName || u.username}
                              </p>
                              {u.departmentName && (
                                <p className="text-xs text-gray-400 truncate">{u.departmentName}</p>
                              )}
                            </div>
                            {selected && <CheckCircle2 size={15} className="shrink-0" />}
                          </button>
                        )
                      })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-3">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                {isEdit && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    disabled={deleting || saving}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition disabled:opacity-60"
                  >
                    {deleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Xóa
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving || deleting}
                  className="flex items-center gap-2 px-5 py-2 text-sm bg-[var(--color-primary)] hover:bg-[#a50e27] text-white rounded-lg font-semibold transition disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Đang lưu...
                    </>
                  ) : isEdit ? (
                    'Lưu thay đổi'
                  ) : (
                    'Tạo phiên họp'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <ConfirmationModal
        open={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
        title="Xóa phiên họp"
        description="Bạn có chắc chắn muốn xóa phiên họp này? Thao tác này không thể hoàn tác."
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  )
}
