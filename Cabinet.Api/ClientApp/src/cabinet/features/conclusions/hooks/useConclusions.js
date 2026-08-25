import { useState, useEffect, useCallback } from 'react'
import { conclusionApi } from '../api/conclusionApi'
import { meetingApi } from '../../meetings/api/meetingApi'

export function useConclusions() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const pageSize = 10

  const fetchData = useCallback(async (currentPage = 1, currentSearch = '') => {
    setLoading(true)
    try {
      const json = await conclusionApi.getAll(currentPage, pageSize, currentSearch)
      const d = Array.isArray(json) ? json : json.data
      if (d && d.items) {
        setData(d.items)
        setTotal(d.total || 0)
      } else if (Array.isArray(d)) {
        setData(d)
        setTotal(d.length)
      }
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMeetings = useCallback(async () => {
    try {
      const json = await meetingApi.getAll()
      const d = Array.isArray(json) ? json : json.data || []
      setMeetings(d)
    } catch {
      setMeetings([])
    }
  }, [])

  useEffect(() => {
    fetchData(1, '')
    fetchMeetings()
  }, [])

  const createConclusion = useCallback(
    async (body) => {
      const json = await conclusionApi.create(body)
      await fetchData(1, search)
      return json
    },
    [fetchData, search]
  )

  const updateConclusion = useCallback(
    async (id, body) => {
      const json = await conclusionApi.update(id, body)
      await fetchData(page, search)
      return json
    },
    [fetchData, page, search]
  )

  const deleteConclusion = useCallback(
    async (id) => {
      await conclusionApi.delete(id)
      await fetchData(page, search)
    },
    [fetchData, page, search]
  )

  return {
    data,
    total,
    meetings,
    loading,
    page,
    search,
    pageSize,
    setPage,
    setSearch,
    fetchData,
    createConclusion,
    updateConclusion,
    deleteConclusion,
  }
}
