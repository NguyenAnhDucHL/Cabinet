import { useState, useEffect, useCallback } from 'react'
import { roomApi } from '../api/roomApi'

export function useRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    try {
      const json = await roomApi.getAll()
      const data = Array.isArray(json) ? json : json.data || []
      setRooms(data)
    } catch {
      setRooms([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRooms()
  }, [])

  const createRoom = useCallback(
    async (body) => {
      const json = await roomApi.create(body)
      await fetchRooms()
      return json
    },
    [fetchRooms]
  )

  const updateRoom = useCallback(
    async (id, body) => {
      const json = await roomApi.update(id, body)
      await fetchRooms()
      return json
    },
    [fetchRooms]
  )

  const deleteRoom = useCallback(async (id) => {
    try {
      await roomApi.delete(id)
      setRooms((prev) => prev.filter((r) => r.id !== id))
      return true
    } catch (e) {
      return false
    }
  }, [])

  const toggleStatus = useCallback(async (id, currentStatus) => {
    setTogglingId(id)
    try {
      const newStatus = currentStatus === 1 ? 0 : 1
      await roomApi.toggleStatus(id, newStatus)
      setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)))
    } finally {
      setTogglingId(null)
    }
  }, [])

  return {
    rooms,
    loading,
    togglingId,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    toggleStatus,
  }
}
