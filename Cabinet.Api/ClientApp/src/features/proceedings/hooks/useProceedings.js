import { useState, useEffect, useCallback } from 'react'
import { proceedingApi } from '../api/proceedingApi'
import { meetingApi } from '../../meetings/api/meetingApi'

export function useProceedings() {
  const [proceedings, setProceedings] = useState([])
  const [allMeetings, setAllMeetings] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [selectedProceeding, setSelectedProceeding] = useState(null)
  const [meetings, setMeetings] = useState([]) // meetings in selected proceeding
  const [loadingList, setLoadingList] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const fetchProceedings = useCallback(async () => {
    setLoadingList(true)
    try {
      const json = await proceedingApi.getAll()
      const data = Array.isArray(json) ? json : json.data || []
      setProceedings(data)
    } catch {
      setProceedings([])
    } finally {
      setLoadingList(false)
    }
  }, [])

  const fetchAllMeetings = useCallback(async () => {
    try {
      const json = await meetingApi.getAll()
      const data = Array.isArray(json) ? json : json.data || []
      setAllMeetings(data)
    } catch {
      setAllMeetings([])
    }
  }, [])

  const fetchDetail = useCallback(async (id) => {
    setLoadingDetail(true)
    try {
      const json = await proceedingApi.getById(id)
      const data = Array.isArray(json) ? json[0] : (json.data ?? json)
      setSelectedProceeding(data)
      setMeetings(data?.meetings || [])
    } catch {
      setSelectedProceeding(null)
      setMeetings([])
    } finally {
      setLoadingDetail(false)
    }
  }, [])

  const selectProceeding = useCallback(
    (item) => {
      setSelectedId(item.id)
      fetchDetail(item.id)
    },
    [fetchDetail]
  )

  useEffect(() => {
    fetchProceedings()
    fetchAllMeetings()
  }, [])

  const createProceeding = useCallback(
    async ({ name, description, meetingId }) => {
      const json = await proceedingApi.create({
        name,
        description,
        meetingId: meetingId ? parseInt(meetingId) : null,
      })
      await fetchProceedings()
      return json
    },
    [fetchProceedings]
  )

  const deleteProceeding = useCallback(
    async (id) => {
      await proceedingApi.delete(id)
      setProceedings((prev) => prev.filter((p) => p.id !== id))
      if (selectedId === id) {
        setSelectedId(null)
        setSelectedProceeding(null)
        setMeetings([])
      }
      return true
    },
    [selectedId]
  )

  const addMeeting = useCallback(
    async (meetingId) => {
      await proceedingApi.addMeeting(selectedId, parseInt(meetingId))
      fetchDetail(selectedId)
    },
    [selectedId, fetchDetail]
  )

  const removeMeeting = useCallback(
    async (meetingId) => {
      await proceedingApi.removeMeeting(selectedId, meetingId)
      fetchDetail(selectedId)
    },
    [selectedId, fetchDetail]
  )

  const availableMeetings = allMeetings.filter((m) => !meetings.some((ex) => ex.id === m.id))

  return {
    proceedings,
    allMeetings,
    availableMeetings,
    meetings,
    selectedId,
    selectedProceeding,
    loadingList,
    loadingDetail,
    selectProceeding,
    fetchProceedings,
    createProceeding,
    deleteProceeding,
    addMeeting,
    removeMeeting,
  }
}
