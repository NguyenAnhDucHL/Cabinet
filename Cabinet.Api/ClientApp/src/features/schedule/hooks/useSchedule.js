import { useState, useEffect, useCallback } from 'react'
import { scheduleApi } from '../api/scheduleApi'

const STATUS_COLORS = {
  'Đang diễn ra': '#16a34a',
  'Sắp diễn ra': '#2563eb',
  'Hoàn thành': '#6b7280',
  Hủy: '#dc2626',
}

const toCalendarEvents = (data) =>
  (Array.isArray(data) ? data : []).map((m) => ({
    id: m.id,
    title: m.title,
    start: m.startTime,
    end: m.endTime,
    backgroundColor: STATUS_COLORS[m.status] ?? '#c8102e',
    borderColor: 'transparent',
    extendedProps: { room: m.roomName, status: m.status, meeting: m },
  }))

/**
 * Hook dùng chung cho tất cả schedule views (personal, leader, unit).
 * @param {'leader' | 'unit'} type - loại schedule
 */
export function useSchedule(type = 'leader') {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMeetings = useCallback(async () => {
    setLoading(true)
    try {
      const json = type === 'unit' ? await scheduleApi.getUnit() : await scheduleApi.getLeader()
      const data = json.data ?? json
      setMeetings(Array.isArray(data) ? data : [])
    } catch (_e) {
      setMeetings([])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  /** Dành cho FullCalendar */
  const calendarEvents = toCalendarEvents(meetings)

  return { meetings, calendarEvents, loading, fetchMeetings }
}
