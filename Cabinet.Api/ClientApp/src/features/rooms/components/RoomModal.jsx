/* eslint-disable */
import React, { useState } from 'react'
import { Building2, X, AlertCircle, Loader2 } from 'lucide-react'

export function RoomModal({ mode, room, departments, onClose, onSaved }) {
  const isEdit = mode === 'edit'
  const isView = mode === 'view'
  const [form, setForm] = useState({
    name: room?.name || '',
    departmentId: room?.departmentId || '',
    status: room?.status ?? 1,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Tên phòng họp không được để trống.')
      return
    }
    setSaving(true)
    setError('')
    const body = {
      name: form.name.trim(),
      departmentId: form.departmentId ? parseInt(form.departmentId) : null,
      status: parseInt(form.status),
    }
    const url = isEdit
      ? `/api/phonghopkhonggiayto/rooms/${room.id}`
      : '/api/phonghopkhonggiayto/rooms'
    try {
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok || json?.error || json?.success === false) {
        setError(json?.message || json?.error || 'Có lỗi xảy ra.')
        return
      }
      onSaved(json, isEdit ? 'updated' : 'created')
    } catch {
      setError('Không thể kết nối đến máy chủ.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--color-primary)]">
          <div className="flex items-center gap-2 text-white">
            <Building2 size={18} />
            <h2 className="font-bold text-base">
              {isView
                ? 'Chi tiết phòng họp'
                : isEdit
                  ? 'Chỉnh sửa phòng họp'
                  : 'Thêm phòng họp mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/20 rounded-lg p-1 transition"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tên phòng họp <span className="text-[var(--color-primary)]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="VD: Hội trường A, tầng 1"
              disabled={isView}
              autoFocus={!isView}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Đơn vị quản lý
            </label>
            <select
              value={form.departmentId}
              onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
              disabled={isView}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition bg-white disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="">-- Không thuộc đơn vị cụ thể --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  !isView && setForm((f) => ({ ...f, status: f.status === 1 ? 0 : 1 }))
                }
                disabled={isView}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.status === 1 ? 'bg-green-500' : 'bg-gray-300'} ${isView ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.status === 1 ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
              <span
                className={`text-sm font-medium ${form.status === 1 ? 'text-green-600' : 'text-gray-500'}`}
              >
                {form.status === 1 ? 'Đang hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-lg">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              {isView ? 'Đóng' : 'Hủy bỏ'}
            </button>
            {!isView && (
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-[var(--color-primary)] hover:bg-[#a50e27] text-white rounded-lg font-semibold transition disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : isEdit ? (
                  'Cập nhật'
                ) : (
                  'Thêm phòng họp'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
