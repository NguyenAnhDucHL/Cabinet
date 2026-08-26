import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Check, Calendar, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Step1Details } from '../../features/meetings/components/MeetingCreate/Step1Details'
import { Step2Participants } from '../../features/meetings/components/MeetingCreate/Step2Participants'
import { Step3Contents } from '../../features/meetings/components/MeetingCreate/Step3Contents'

export function CabinetMeetingCreate({ onBack, onSaved }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState([])
  const [proceedings, setProceedings] = useState([])
  const [users, setUsers] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    proceedingId: '',
    singleContent: false,
    startTime: '',
    endTime: '',
    roomId: '',
    meetingType: '',
    onlineMeetingUrl: '',
    location: '',
  })

  const [selectedUsers, setSelectedUsers] = useState([])
  const [programFiles, setProgramFiles] = useState([])
  const [invitationFiles, setInvitationFiles] = useState([])

  const [participantTab, setParticipantTab] = useState('NhomThanhVien')
  const [groupType, setGroupType] = useState(
    'Ban Thường vụ Đảng ủy phường Cẩm Phả, Tỉnh Quảng Ninh'
  )
  const [participantSearch, setParticipantSearch] = useState('')
  const [presidingUsers, setPresidingUsers] = useState([])

  const [contentTabs, setContentTabs] = useState([{ id: 1, title: 'Nội dung 1' }])
  const [activeContentTab, setActiveContentTab] = useState(1)

  const programInputRef = useRef(null)
  const invitationInputRef = useRef(null)

  useEffect(() => {
    fetch('/api/phonghopkhonggiayto/rooms')
      .then((r) => r.json())
      .then((j) => setRooms(j.data || j || []))
    fetch('/api/phonghopkhonggiayto/proceedings')
      .then((r) => r.json())
      .then((j) => setProceedings(j.data || j || []))
    fetch('/api/users')
      .then((r) => r.json())
      .then((j) => setUsers(j.data || j || []))
  }, [])

  const handleSubmit = async () => {
    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert('Vui lòng nhập đầy đủ tên phiên họp và thời gian')
      return
    }
    setLoading(true)
    const requestJson = {
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
      roomId: formData.roomId ? parseInt(formData.roomId) : null,
      location: formData.location,
      proceedingId: formData.proceedingId ? parseInt(formData.proceedingId) : null,
      meetingType: formData.meetingType,
      onlineMeetingUrl: formData.onlineMeetingUrl,
      participantUserIds: presidingUsers, // mock selected users
    }
    const fd = new FormData()
    fd.append('requestJson', JSON.stringify(requestJson))
    programFiles.forEach((f) => fd.append('programFiles', f))
    invitationFiles.forEach((f) => fd.append('invitationFiles', f))

    try {
      const res = await fetch('/api/phonghopkhonggiayto/meetings', { method: 'POST', body: fd })
      const json = await res.json()
      if (res.ok && !json.error) onSaved()
      else alert(json.message || json.error || 'Có lỗi xảy ra')
    } catch (err) {
      alert('Lỗi kết nối máy chủ')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Chi tiết phiên họp' },
    { id: 2, title: 'Thành phần tham dự' },
    { id: 3, title: 'Nội dung họp' },
    { id: 4, title: 'Sơ đồ vị trí' },
  ]

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Tạo phiên họp mới</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
          >
            <Calendar size={16} className="mr-2" /> Nhắc lịch họp
          </Button>
          <Button
            variant="outline"
            className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
          >
            <Info size={16} className="mr-2" /> Thêm thông báo mới họp
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-4xl mx-auto overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-100 -z-10" />
              {steps.map((s) => {
                const isActive = step === s.id
                const isPassed = step > s.id
                return (
                  <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${isActive ? 'bg-[#c8102e] text-white border-2 border-[#c8102e]' : isPassed ? 'bg-white text-[#c8102e] border-2 border-[#c8102e]' : 'bg-white text-gray-400 border-2 border-gray-200'}`}
                    >
                      {isPassed ? <Check size={16} /> : s.id}
                    </div>
                    <span
                      className={`text-xs font-medium ${isActive || isPassed ? 'text-gray-800' : 'text-gray-400'}`}
                    >
                      {s.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex-1 p-8 overflow-y-auto">
            {step === 1 && (
              <Step1Details
                formData={formData}
                setFormData={setFormData}
                proceedings={proceedings}
                rooms={rooms}
                programFiles={programFiles}
                setProgramFiles={setProgramFiles}
                programInputRef={programInputRef}
                invitationFiles={invitationFiles}
                setInvitationFiles={setInvitationFiles}
                invitationInputRef={invitationInputRef}
              />
            )}
            {step === 2 && (
              <Step2Participants
                users={users}
                participantTab={participantTab}
                setParticipantTab={setParticipantTab}
                groupType={groupType}
                setGroupType={setGroupType}
                participantSearch={participantSearch}
                setParticipantSearch={setParticipantSearch}
                presidingUsers={presidingUsers}
                setPresidingUsers={setPresidingUsers}
              />
            )}
            {step === 3 && (
              <Step3Contents
                users={users}
                contentTabs={contentTabs}
                setContentTabs={setContentTabs}
                activeContentTab={activeContentTab}
                setActiveContentTab={setActiveContentTab}
              />
            )}
            {step === 4 && (
              <div className="text-center text-gray-500 py-10">Chưa hỗ trợ (Sơ đồ vị trí)</div>
            )}
          </div>
          <div className="px-8 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <div>
              <Button variant="outline" onClick={onBack} className="text-gray-600">
                Quay lại
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="text-[#c8102e] border-[#c8102e] hover:bg-red-50">
                Lưu nháp
              </Button>
              {step < steps.length ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  className="bg-[#c8102e] hover:bg-red-700 text-white min-w-[120px]"
                >
                  Tiếp tục
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#c8102e] hover:bg-red-700 text-white min-w-[120px]"
                >
                  {loading ? 'Đang lưu...' : 'Lưu phiên họp'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
