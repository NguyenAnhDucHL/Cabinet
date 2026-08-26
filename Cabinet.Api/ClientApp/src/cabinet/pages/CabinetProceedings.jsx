import { useState, useRef } from 'react'
import { Plus, Search, RefreshCw, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProceedings } from '../../features/proceedings/hooks/useProceedings'
import { ProceedingSidebar } from '../../features/proceedings/components/ProceedingSidebar'
import { ProceedingDetail } from '../../features/proceedings/components/ProceedingDetail'
import {
  ProceedingCreateModal,
  ProceedingAddMeetingModal,
} from '../../features/proceedings/components/ProceedingModals'

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
        <ProceedingSidebar
          proceedings={filteredProceedings}
          loading={loadingList}
          selectedId={selectedId}
          menuOpenId={menuOpenId}
          menuRef={menuRef}
          onSelect={(item) => {
            selectProceeding(item)
            setMenuOpenId(null)
          }}
          onMenuToggle={setMenuOpenId}
          onDelete={deleteProceeding}
        />
      </div>

      {/* Right Detail Panel */}
      <div className="flex-1 bg-white rounded-lg p-6 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-lg text-slate-800">
              {selectedProceeding ? selectedProceeding.name : 'Chi tiết kỷ yếu'}
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
        <div className="flex-1 overflow-y-auto">
          <ProceedingDetail
            selectedProceeding={selectedProceeding}
            meetings={filteredMeetings}
            loading={loadingDetail}
            onRemoveMeeting={removeMeeting}
            onAddMeeting={() => setIsAddMeetingModalOpen(true)}
          />
        </div>
      </div>

      <ProceedingCreateModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        allMeetings={allMeetings}
        formName={formName}
        setFormName={setFormName}
        formDesc={formDesc}
        setFormDesc={setFormDesc}
        formMeetingId={formMeetingId}
        setFormMeetingId={setFormMeetingId}
        onSubmit={handleCreate}
        saving={saving}
      />

      <ProceedingAddMeetingModal
        open={isAddMeetingModalOpen}
        onOpenChange={setIsAddMeetingModalOpen}
        selectedProceedingName={selectedProceeding?.name}
        availableMeetings={availableMeetings}
        addMeetingId={addMeetingId}
        setAddMeetingId={setAddMeetingId}
        onSubmit={handleAddMeeting}
        saving={addingMeeting}
      />
    </div>
  )
}
