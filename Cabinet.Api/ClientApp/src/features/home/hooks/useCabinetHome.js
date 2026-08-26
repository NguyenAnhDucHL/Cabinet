import { useState, useEffect } from 'react'
import { ATTENDANCE_STATUS } from '../../../constants/meeting'

const BASE = '/api/phonghopkhonggiayto'

export function useCabinetHome(selectedMonth, selectedYear) {
  const [ongoingMeetings, setOngoingMeetings] = useState([])
  const [upcomingMeetings, setUpcomingMeetings] = useState([])
  const [unconfirmedMeetings] = useState([])
  const [unansweredQuestions] = useState([])
  const [stats, setStats] = useState({ attended: 0, pending: 0, absent: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [confirmMeeting, setConfirmMeeting] = useState(null)

  const fetchDashboardData = () => {
    setLoading(true)
    Promise.all([
      fetch(`${BASE}/meetings/schedule`)
        .then((r) => r.json())
        .catch(() => null),
      fetch(`${BASE}/meetings/my-meetings`)
        .then((r) => r.json())
        .catch(() => null),
    ]).then(([scheduleData, myMeetingsData]) => {
      if (scheduleData?.data) {
        const now = new Date()
        let filtered = scheduleData.data
        if (selectedMonth && selectedYear) {
          filtered = filtered.filter((m) => {
            const d = new Date(m.startTime)
            return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
          })
        }
        setOngoingMeetings(
          filtered.filter((m) => {
            const s = new Date(m.startTime)
            const e = new Date(m.endTime)
            return s <= now && e >= now
          })
        )
        setUpcomingMeetings(
          filtered
            .filter((m) => new Date(m.startTime) > now)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .slice(0, 5)
        )
      }

      if (myMeetingsData?.data) {
        let myMeetings = myMeetingsData.data
        if (selectedMonth && selectedYear) {
          myMeetings = myMeetings.filter((m) => {
            const d = new Date(m.startTime)
            return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
          })
        }
        const attended = myMeetings.filter(
          (m) => m.participants?.[0]?.attendanceStatus === ATTENDANCE_STATUS.JOINED
        ).length
        const pending = myMeetings.filter(
          (m) =>
            m.participants?.[0]?.attendanceStatus === 'Chưa xác nhận' ||
            !m.participants?.[0]?.attendanceStatus
        ).length
        const absent = myMeetings.filter(
          (m) => m.participants?.[0]?.attendanceStatus === 'Vắng mặt'
        ).length
        setStats({ attended, pending, absent, total: myMeetings.length })
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear])

  const handleJoinMeeting = (meeting) => setConfirmMeeting(meeting)

  const handleConfirmAttendance = async () => {
    if (!confirmMeeting) return
    try {
      await fetch(`${BASE}/meetings/${confirmMeeting.id}/attendance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: ATTENDANCE_STATUS.JOINED }),
      })
      setConfirmMeeting(null)
      fetchDashboardData()
    } catch (_e) {
      setConfirmMeeting(null)
    }
  }

  return {
    ongoingMeetings,
    upcomingMeetings,
    unconfirmedMeetings,
    unansweredQuestions,
    stats,
    loading,
    confirmMeeting,
    setConfirmMeeting,
    handleJoinMeeting,
    handleConfirmAttendance,
    fetchDashboardData,
  }
}
