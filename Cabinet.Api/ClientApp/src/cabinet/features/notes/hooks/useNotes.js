import { useState, useEffect, useCallback } from 'react'
import { noteApi } from '../api/noteApi'
import { meetingApi } from '../../meetings/api/meetingApi'

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = useCallback(async (search = '') => {
    setLoading(true)
    try {
      const json = await noteApi.getByUser(search)
      const data = Array.isArray(json) ? json : json.data || []
      setNotes(data)
    } catch {
      setNotes([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMeetings = useCallback(async () => {
    try {
      const json = await meetingApi.getAll()
      const data = Array.isArray(json) ? json : json.data || []
      setMeetings(data)
    } catch {
      setMeetings([])
    }
  }, [])

  useEffect(() => {
    fetchNotes()
    fetchMeetings()
  }, [])

  const createNote = useCallback(
    async (formData) => {
      const json = await noteApi.create(formData)
      await fetchNotes()
      return json
    },
    [fetchNotes]
  )

  const deleteNote = useCallback(async (id) => {
    if (!window.confirm('Xóa ghi chú này?')) return false
    await noteApi.delete(id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
    return true
  }, [])

  return { notes, meetings, loading, fetchNotes, createNote, deleteNote }
}
