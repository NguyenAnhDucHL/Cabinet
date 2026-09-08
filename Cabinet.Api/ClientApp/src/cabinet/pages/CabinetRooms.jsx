import React, { useState, useEffect, useCallback } from 'react'
import { FileText } from 'lucide-react'
import { RoomModal } from '../../features/rooms/components/RoomModal'
import { DeleteConfirm } from '../../features/rooms/components/DeleteConfirm'
import { Toast } from '../../features/rooms/components/CabinetRooms/Toast'
import { RoomHeader } from '../../features/rooms/components/CabinetRooms/RoomHeader'
import { RoomTable } from '../../features/rooms/components/CabinetRooms/RoomTable'
import { ROOMS_SIDEBAR } from '../../features/appshell/constants/navigation'

export function CabinetRooms({ activeTab = 0 }) {
  const [rooms, setRooms] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [togglingId, setTogglingId] = useState(null)
  const [modal, setModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const pageSize = 10

  const showToast = (message, type = 'success') => setToast({ message, type })

  const fetchRooms = useCallback(() => {
    setLoading(true)
    fetch('/api/phonghopkhonggiayto/rooms')
      .then((r) => r.json())
      .then((json) => setRooms(Array.isArray(json) ? json : json.data || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchRooms()
    fetch('/api/phonghopkhonggiayto/rooms/departments')
      .then((r) => r.json())
      .then((json) => setDepartments(Array.isArray(json) ? json : json.data || []))
      .catch(() => setDepartments([]))
  }, [fetchRooms])

  const handleToggle = async (room) => {
    setTogglingId(room.id)
    const newStatus = room.status === 1 ? 0 : 1
    try {
      const res = await fetch(`/api/phonghopkhonggiayto/rooms/${room.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (res.ok && json.success !== false) {
        setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, status: newStatus } : r)))
        showToast(newStatus === 1 ? 'Đã bật phòng họp.' : 'Đã tắt phòng họp.')
      } else {
        showToast(json.message || 'Không thể cập nhật trạng thái.', 'error')
      }
    } catch {
      showToast('Lỗi kết nối máy chủ.', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  const handleSaved = (savedRoom, action) => {
    if (!savedRoom || typeof savedRoom !== 'object') {
      fetchRooms()
      showToast(
        action === 'created' ? 'Thêm phòng họp thành công!' : 'Cập nhật phòng họp thành công!'
      )
      setModal(null)
      return
    }
    if (action === 'created') setRooms((prev) => [savedRoom, ...prev])
    else setRooms((prev) => prev.map((r) => (r.id === savedRoom.id ? savedRoom : r)))

    showToast(
      action === 'created' ? 'Thêm phòng họp thành công!' : 'Cập nhật phòng họp thành công!'
    )
    setModal(null)
  }

  const handleDeleted = (id) => {
    setRooms((prev) => prev.filter((r) => r.id !== id))
    setDeleteTarget(null)
    showToast('Xóa phòng họp thành công.')
  }

  const filtered = rooms.filter(
    (r) =>
      !search ||
      (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.departmentName || '').toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (activeTab > 0) {
    const tabLabel = ROOMS_SIDEBAR[activeTab]?.label || 'Tính năng'
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <FileText size={28} className="opacity-25" />
        </div>
        <h3 className="text-base font-bold text-gray-600 mb-1">Đang phát triển</h3>
        <p className="text-sm">{tabLabel} sẽ sớm được cập nhật.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {modal && (
        <RoomModal
          mode={modal.mode}
          room={modal.room}
          departments={departments}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          room={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}

      <RoomHeader setModal={setModal} />

      <RoomTable
        rooms={rooms}
        loading={loading}
        search={search}
        setSearch={setSearch}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        filtered={filtered}
        paged={paged}
        totalPages={totalPages}
        setModal={setModal}
        setDeleteTarget={setDeleteTarget}
        handleToggle={handleToggle}
        togglingId={togglingId}
      />
    </div>
  )
}
