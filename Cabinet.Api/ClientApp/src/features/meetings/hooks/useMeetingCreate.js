import { useState, useEffect, useRef } from 'react'

export function useMeetingCreate({ onSaved }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState([])
  const [proceedings, setProceedings] = useState([])
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
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
  const [groupType, setGroupType] = useState('')
  const [participantSearch, setParticipantSearch] = useState('')
  const [presidingUsers, setPresidingUsers] = useState([])
  const [contentTabs, setContentTabs] = useState([
    { id: 1, title: 'Nội dung 1' },
    { id: 2, title: 'Nội dung 2' },
    { id: 3, title: 'Nội dung 3' },
    { id: 4, title: 'Nội dung 4' },
  ])
  const [activeContentTab, setActiveContentTab] = useState(4)
  const programInputRef = useRef(null)
  const invitationInputRef = useRef(null)

  useEffect(() => {
    fetch('/api/phonghopkhonggiayto/rooms')
      .then((r) => r.json())
      .then((json) => setRooms(Array.isArray(json) ? json : json.data || []))
      .catch(() => {})

    fetch('/api/phonghopkhonggiayto/proceedings')
      .then((r) => r.json())
      .then((json) => setProceedings(Array.isArray(json) ? json : json.data || []))
      .catch(() => {})

    fetch('/api/users')
      .then((r) => r.json())
      .then((json) => setUsers(Array.isArray(json) ? json : json.data || []))
      .catch(() => {})

    fetch('/api/users/departments')
      .then((r) => r.json())
      .then((json) => setDepartments(Array.isArray(json) ? json : json.data || []))
      .catch(() => {})
  }, [])

  const usersInSelectedDept = groupType
    ? users.filter((u) => u.departmentId === Number(groupType))
    : users

  const handleFileChange = (e, setFiles) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files)])
  }
  const removeFile = (idx, setFiles) => setFiles((prev) => prev.filter((_, i) => i !== idx))

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
      participantUserIds: selectedUsers,
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
    } catch {
      alert('Lỗi kết nối máy chủ')
    } finally {
      setLoading(false)
    }
  }

  return {
    step,
    setStep,
    loading,
    rooms,
    proceedings,
    users,
    departments,
    usersInSelectedDept,
    formData,
    setFormData,
    selectedUsers,
    setSelectedUsers,
    programFiles,
    setProgramFiles,
    invitationFiles,
    setInvitationFiles,
    participantTab,
    setParticipantTab,
    groupType,
    setGroupType,
    participantSearch,
    setParticipantSearch,
    presidingUsers,
    setPresidingUsers,
    contentTabs,
    setContentTabs,
    activeContentTab,
    setActiveContentTab,
    programInputRef,
    invitationInputRef,
    handleFileChange,
    removeFile,
    handleSubmit,
  }
}
