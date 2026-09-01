import { useState, useEffect, useCallback } from 'react'
import { noteApi } from '../api/noteApi'
import { meetingApi } from '../../meetings/api/meetingApi'

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchNotes = useCallback(async (q = '') => {
    setLoading(true)
    try {
      const json = await noteApi.getByUser(q)
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
  }, [fetchNotes, fetchMeetings])

  const createNote = useCallback(
    async (formData) => {
      const json = await noteApi.create(formData)
      await fetchNotes(search)
      return json
    },
    [fetchNotes, search]
  )

  const deleteNote = useCallback(async (id) => {
    try {
      await noteApi.delete(id)
      setNotes((prev) => prev.filter((n) => n.id !== id))
      return true
    } catch {
      return false
    }
  }, [])

  return { notes, meetings, loading, search, setSearch, fetchNotes, createNote, deleteNote }
}
