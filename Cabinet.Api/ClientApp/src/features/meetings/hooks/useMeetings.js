import { useState, useEffect, useCallback } from 'react'
import { meetingApi } from '../api/meetingApi'
import { ROLES } from '../../../../constants/roles'

const getRole = () => {
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

export function useMeetings(initialTab = 'invited') {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(initialTab)
  const role = getRole()
  const isAdmin = role === ROLES.ADMIN || role === ROLES.LANH_DAO

  const fetchMeetings = useCallback(
    async (tab = activeTab) => {
      setLoading(true)
      try {
        const isAllTab = isAdmin && tab === 'all'
        const json = isAllTab ? await meetingApi.getAll() : await meetingApi.getMyMeetings()
        const data = Array.isArray(json) ? json : json.data || []
        setMeetings(
          data.map((m) => ({
            ...m,
            attendanceStatus: m.participants?.[0]?.attendanceStatus ?? 'Chưa xác nhận',
          }))
        )
      } catch {
        setMeetings([])
      } finally {
        setLoading(false)
      }
    },
    [activeTab, isAdmin]
  )

  useEffect(() => {
    fetchMeetings(activeTab)
    const handler = () => fetchMeetings(activeTab)
    document.addEventListener('realtime:meeting_updated', handler)
    return () => document.removeEventListener('realtime:meeting_updated', handler)
  }, [activeTab])

  const deleteMeeting = useCallback(async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phiên họp này?')) return false
    try {
      await meetingApi.delete(id)
      setMeetings((prev) => prev.filter((m) => m.id !== id))
      return true
    } catch {
      alert('Lỗi kết nối máy chủ.')
      return false
    }
  }, [])

  return { meetings, loading, activeTab, setActiveTab, isAdmin, fetchMeetings, deleteMeeting }
}
