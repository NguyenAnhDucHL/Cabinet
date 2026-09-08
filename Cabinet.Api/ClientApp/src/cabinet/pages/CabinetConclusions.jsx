import { useState } from 'react'
import { Search, Plus, RefreshCw, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useConclusions } from '../../features/conclusions/hooks/useConclusions'
import { ConclusionTable } from '../../features/conclusions/components/ConclusionTable'
import { ConclusionFormModal } from '../../features/conclusions/components/ConclusionFormModal'
import { conclusionApi } from '../../features/conclusions/api/conclusionApi'

export function CabinetConclusions() {
  const {
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
  } = useConclusions()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formMeetingId, setFormMeetingId] = useState('')
  const [formFileName, setFormFileName] = useState('')
  const [formDocumentNumber, setFormDocumentNumber] = useState('')
  const [formDocumentDate, setFormDocumentDate] = useState('')
  const [formStatus, setFormStatus] = useState('Chưa xử lý')

  const totalPages = Math.ceil(total / pageSize)

  const handleSearch = (e) => {
    const q = e.target.value
    setSearch(q)
    setPage(1)
    fetchData(1, q)
  }

  const handleCreate = async () => {
    if (!formMeetingId) return
    setSaving(true)
    try {
      await createConclusion({
        meetingId: Number(formMeetingId),
        fileName: formFileName || null,
        documentNumber: formDocumentNumber || null,
        documentDate: formDocumentDate ? new Date(formDocumentDate).toISOString() : null,
        status: formStatus,
        progress: 0,
      })
      setIsAddOpen(false)
      setFormMeetingId('')
      setFormFileName('')
      setFormDocumentNumber('')
      setFormDocumentDate('')
      setFormStatus('Chưa xử lý')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-xl text-slate-800">Tra cứu kết luận sau phiên họp</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50"
            onClick={async () => {
              try {
                const blob = await conclusionApi.export(search)
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `DanhSachKetLuan_${new Date().getTime()}.xls`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
              } catch (e) {
                alert(e.message || 'Có lỗi khi xuất Excel')
              }
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[var(--color-primary)] hover:bg-[#a50e27] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="font-medium text-slate-800">Danh sách kết luận ({total})</div>
        <div className="flex items-center gap-2">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên phiên họp, file..."
              className="pl-9 bg-white"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={() => fetchData(page, search)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConclusionTable data={data} loading={loading} page={page} pageSize={pageSize} />

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => {
                setPage(i + 1)
                fetchData(i + 1, search)
              }}
              className={`w-8 h-8 rounded text-sm font-medium transition ${page === i + 1 ? 'bg-[var(--color-primary)] text-white' : 'text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ConclusionFormModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        meetings={meetings}
        formMeetingId={formMeetingId}
        setFormMeetingId={setFormMeetingId}
        formFileName={formFileName}
        setFormFileName={setFormFileName}
        formDocumentNumber={formDocumentNumber}
        setFormDocumentNumber={setFormDocumentNumber}
        formDocumentDate={formDocumentDate}
        setFormDocumentDate={setFormDocumentDate}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        onSubmit={handleCreate}
        saving={saving}
      />
    </div>
  )
}
