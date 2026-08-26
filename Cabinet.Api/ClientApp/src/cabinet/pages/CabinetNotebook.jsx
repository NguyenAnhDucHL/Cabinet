import { useState } from 'react'
import { Search, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNotes } from '../../features/notes/hooks/useNotes'
import { NoteTable } from '../../features/notes/components/NoteTable'
import { NoteFormModal } from '../../features/notes/components/NoteFormModal'

export function CabinetNotebook() {
  const { notes, meetings, loading, search, setSearch, fetchNotes, deleteNote, createNote } =
    useNotes()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formMeetingId, setFormMeetingId] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formFiles, setFormFiles] = useState([])

  const handleSearch = (e) => {
    const q = e.target.value
    setSearch(q)
    fetchNotes(q)
  }

  const handleCreate = async () => {
    if (!formMeetingId || !formContent.trim()) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('meetingId', formMeetingId)
      fd.append('content', formContent)
      formFiles.forEach((f) => fd.append('files', f))
      await createNote(fd)
      setIsAddModalOpen(false)
      setFormMeetingId('')
      setFormContent('')
      setFormFiles([])
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-xl text-slate-800">Sổ tay ghi chú</h3>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#c8102e] hover:bg-[#a50e27] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="font-medium text-slate-800">Danh sách ghi chú ({notes.length})</div>
        <div className="flex items-center gap-2">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên phiên họp..."
              className="pl-9 bg-white"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={() => fetchNotes(search)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <NoteTable notes={notes} loading={loading} onDelete={deleteNote} />

      <NoteFormModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        meetings={meetings}
        formMeetingId={formMeetingId}
        setFormMeetingId={setFormMeetingId}
        formContent={formContent}
        setFormContent={setFormContent}
        formFiles={formFiles}
        setFormFiles={setFormFiles}
        onSubmit={handleCreate}
        saving={saving}
      />
    </div>
  )
}
