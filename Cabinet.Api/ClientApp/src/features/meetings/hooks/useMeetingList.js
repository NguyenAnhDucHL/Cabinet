import { useState, useEffect, useCallback } from 'react'
import { meetingApi } from '../api/meetingApi'
import { ROLES } from '../../../constants/roles'
import { ATTENDANCE_STATUS } from '../../../constants/meeting'

function getRole() {
  try {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      return (
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        payload.role ||
        payload.Role
      )
    }
    return null
  } catch {
    return null
  }
}

export function useMeetingList() {
  const role = getRole()
  const isAdmin = role === ROLES.ADMIN || role === ROLES.LANH_DAO

  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('invited')

  const fetchMeetings = useCallback(
    (tab = activeTab) => {
      setLoading(true)
      const url =
        isAdmin && tab === 'all'
          ? '/api/phonghopkhonggiayto/meetings/schedule'
          : '/api/phonghopkhonggiayto/meetings/my-meetings'

      fetch(url)
        .then((r) => r.json())
        .then((json) => {
          const data = Array.isArray(json) ? json : json.data || []
          setMeetings(
            data.map((m) => ({
              ...m,
              attendanceStatus: m.participants?.[0]?.attendanceStatus ?? ATTENDANCE_STATUS.PENDING,
            }))
          )
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    },
    [isAdmin, activeTab]
  )

  const deleteMeeting = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/phonghopkhonggiayto/meetings/${id}`, { method: 'DELETE' })
        const json = await res.json()
        if (json.success) {
          fetchMeetings(activeTab)
        } else {
          alert('Có lỗi xảy ra: ' + (json.message || 'Không thể xóa phiên họp.'))
        }
      } catch {
        alert('Lỗi kết nối máy chủ.')
      }
    },
    [activeTab, fetchMeetings]
  )

  const confirmAttendance = useCallback(
    async (meetingId, status) => {
      try {
        const json = await meetingApi.updateAttendance(meetingId, status)
        if (json.success) {
          fetchMeetings(activeTab)
        } else {
          alert('Có lỗi xảy ra: ' + (json.message || 'Không thể xác nhận tham gia.'))
        }
      } catch {
        alert('Lỗi kết nối máy chủ.')
      }
    },
    [activeTab, fetchMeetings]
  )

  useEffect(() => {
    fetchMeetings(activeTab)
    const handler = () => fetchMeetings(activeTab)
    document.addEventListener('realtime:meeting_updated', handler)
    return () => document.removeEventListener('realtime:meeting_updated', handler)
  }, [activeTab])

  return {
    meetings,
    loading,
    activeTab,
    setActiveTab,
    isAdmin,
    fetchMeetings,
    deleteMeeting,
    confirmAttendance,
  }
}
