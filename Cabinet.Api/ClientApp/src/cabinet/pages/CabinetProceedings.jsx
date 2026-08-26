/* eslint-disable */
import React, { useState, useRef } from 'react'
import {
  Plus,
  Search,
  RefreshCw,
  MoreVertical,
  Folder,
  FileText,
  Link,
  Unlink,
  ChevronRight,
  Loader2,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProceedings } from '../../features/proceedings/hooks/useProceedings'

const fmt = (dt) => {
  if (!dt) return ''
  const d = new Date(dt)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export function CabinetProceedings() {
  const {
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
  } = useProceedings()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAddMeetingModalOpen, setIsAddMeetingModalOpen] = useState(false)
  const [searchLeft, setSearchLeft] = useState('')
  const [searchRight, setSearchRight] = useState('')
  const [menuOpenId, setMenuOpenId] = useState(null)
  const menuRef = useRef(null)
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formMeetingId, setFormMeetingId] = useState('')
  const [saving, setSaving] = useState(false)
  const [addMeetingId, setAddMeetingId] = useState('')
  const [addingMeeting, setAddingMeeting] = useState(false)

  const filteredProceedings = proceedings.filter((p) =>
    p.name?.toLowerCase().includes(searchLeft.toLowerCase())
  )
  const filteredMeetings = meetings.filter((m) =>
    m.title?.toLowerCase().includes(searchRight.toLowerCase())
  )

  const handleCreate = async () => {
    if (!formName.trim()) return
    setSaving(true)
    try {
      await createProceeding({ name: formName, description: formDesc, meetingId: formMeetingId })
      setIsAddModalOpen(false)
      setFormName('')
      setFormDesc('')
      setFormMeetingId('')
    } finally {
      setSaving(false)
    }
  }

  const handleAddMeeting = async () => {
    if (!addMeetingId) return
    setAddingMeeting(true)
    try {
      await addMeeting(addMeetingId)
      setIsAddMeetingModalOpen(false)
      setAddMeetingId('')
    } finally {
      setAddingMeeting(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Left Sidebar */}
      <div className="w-[400px] flex-shrink-0 bg-white rounded-lg p-6 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-slate-800">Danh sách kỷ yếu</h3>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#c8102e] hover:bg-[#a50e27] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm mới
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên kỷ yếu"
              className="pl-9 bg-white"
              value={searchLeft}
              onChange={(e) => setSearchLeft(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="text-gray-500" onClick={fetchProceedings}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredProceedings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <FileText className="h-10 w-10 mb-2" />
              <p className="text-sm">Chưa có kỷ yếu nào</p>
            </div>
          ) : (
            filteredProceedings.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  selectProceeding(item)
                  setMenuOpenId(null)
                }}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer mb-1 ${selectedId === item.id ? 'bg-red-50 border border-red-100' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Folder
                    className={`h-5 w-5 flex-shrink-0 ${selectedId === item.id ? 'text-[#c8102e]' : 'text-gray-400'}`}
                  />
                  <span
                    className={`text-sm truncate ${selectedId === item.id ? 'font-semibold text-[#c8102e]' : 'text-gray-700'}`}
                  >
                    {item.name}
                  </span>
                </div>
                <div className="relative" ref={menuOpenId === item.id ? menuRef : null}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuOpenId(menuOpenId === item.id ? null : item.id)
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  {menuOpenId === item.id && (
                    <div
                      className="absolute right-0 top-9 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          selectProceeding(item)
                          setMenuOpenId(null)
                          setIsAddMeetingModalOpen(true)
                        }}
                      >
                        <Link className="h-4 w-4 text-blue-500" />
                        Gắn phiên họp
                      </button>
                      <button
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => {
                          deleteProceeding(item.id)
                          setMenuOpenId(null)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa kỷ yếu
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-white rounded-lg p-6 shadow-sm flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg text-slate-800">
              {selectedProceeding
                ? selectedProceeding.name
                : 'Chọn kỷ yếu để xem danh sách phiên họp'}
            </h3>
            {selectedProceeding?.description && (
              <p className="text-sm text-gray-500 mt-1">{selectedProceeding.description}</p>
            )}
          </div>
          {selectedProceeding && (
            <div className="flex items-center gap-3">
              <div className="relative w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm phiên họp"
                  className="pl-9 bg-white"
                  value={searchRight}
                  onChange={(e) => setSearchRight(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                onClick={() => setIsAddMeetingModalOpen(true)}
              >
                <Link className="h-4 w-4 mr-2" />
                Gắn phiên họp
              </Button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {loadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : !selectedProceeding ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Folder className="h-14 w-14 mb-3" />
              <p className="text-sm">Chọn một kỷ yếu ở bên trái để xem danh sách phiên họp</p>
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <FileText className="h-10 w-10 mb-2" />
              <p className="text-sm">Kỷ yếu này chưa có phiên họp nào</p>
              <Button
                variant="outline"
                className="mt-4 text-blue-600 border-blue-300 hover:bg-blue-50"
                onClick={() => setIsAddMeetingModalOpen(true)}
              >
                <Link className="h-4 w-4 mr-2" />
                Gắn phiên họp vào kỷ yếu
              </Button>
            </div>
          ) : (
            filteredMeetings.map((m) => (
              <div
                key={m.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-gray-300 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{m.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {fmt(m.startTime)}
                      {m.endTime ? ` → ${fmt(m.endTime)}` : ''}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Gỡ phiên họp khỏi kỷ yếu"
                  onClick={() => removeMeeting(m.id)}
                >
                  <Unlink className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal — Tạo mới kỷ yếu */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm mới kỷ yếu phiên họp</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>
                Tên kỷ yếu <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="VD: Kỷ yếu Kỳ họp HĐND tháng 7/2026"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Gắn phiên họp (tùy chọn)</Label>
              <Select value={formMeetingId} onValueChange={setFormMeetingId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phiên họp" />
                </SelectTrigger>
                <SelectContent>
                  {allMeetings.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                placeholder="Nhập mô tả kỷ yếu"
                rows={3}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button
                className="bg-[#c8102e] hover:bg-[#a50e27] text-white"
                onClick={handleCreate}
                disabled={saving || !formName.trim()}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Thêm mới
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal — Gắn thêm phiên họp */}
      <Dialog open={isAddMeetingModalOpen} onOpenChange={setIsAddMeetingModalOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Gắn phiên họp vào kỷ yếu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-gray-500">
              Kỷ yếu:{' '}
              <span className="font-semibold text-slate-800">{selectedProceeding?.name}</span>
            </p>
            <div className="space-y-2">
              <Label>
                Chọn phiên họp <span className="text-red-500">*</span>
              </Label>
              <Select value={addMeetingId} onValueChange={setAddMeetingId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phiên họp cần gắn" />
                </SelectTrigger>
                <SelectContent>
                  {availableMeetings.length === 0 ? (
                    <SelectItem value="__none__" disabled>
                      Không còn phiên họp nào để gắn
                    </SelectItem>
                  ) : (
                    availableMeetings.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddMeetingModalOpen(false)
                  setAddMeetingId('')
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddMeeting}
                disabled={addingMeeting || !addMeetingId || addMeetingId === '__none__'}
              >
                {addingMeeting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Link className="h-4 w-4 mr-2" />
                )}
                Gắn vào kỷ yếu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
