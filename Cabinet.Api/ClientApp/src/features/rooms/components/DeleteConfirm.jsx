/* eslint-disable */
import React, { useState } from 'react'
import { Trash2, AlertCircle, Loader2 } from 'lucide-react'

export function DeleteConfirm({ room, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setDeleting(true)
    setError('')
    try {
      const res = await fetch(`/api/phonghopkhonggiayto/rooms/${room.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok || json.success === false) {
        setError(json.message || 'Không thể xóa phòng họp này.')
        return
      }
      onDeleted(room.id)
    } catch {
      setError('Không thể kết nối đến máy chủ.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Trash2 size={24} className="text-[var(--color-primary)]" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">Xóa phòng họp?</h3>
          <p className="text-sm text-gray-500 mb-1">
            Bạn có chắc muốn xóa phòng họp{' '}
            <span className="font-semibold text-gray-700">"{room.name}"</span>?
          </p>
          <p className="text-xs text-gray-400 mb-5">
            Hành động này không thể hoàn tác. Phòng họp đang có lịch họp trong tương lai sẽ không
            thể xóa.
          </p>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg w-full mb-4">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition font-medium"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2.5 text-sm bg-[var(--color-primary)] hover:bg-[#a50e27] text-white rounded-lg font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
