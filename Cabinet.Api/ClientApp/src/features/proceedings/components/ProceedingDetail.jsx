import { ChevronRight, FileText, Folder, Loader2, Unlink, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fmt = (dt) => {
  if (!dt) return ''
  const d = new Date(dt)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export function ProceedingDetail({
  selectedProceeding,
  meetings,
  loading,
  onRemoveMeeting,
  onAddMeeting,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!selectedProceeding) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Folder className="h-14 w-14 mb-3" />
        <p className="text-sm">Chọn một kỷ yếu ở bên trái để xem danh sách phiên họp</p>
      </div>
    )
  }

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FileText className="h-10 w-10 mb-2" />
        <p className="text-sm">Kỷ yếu này chưa có phiên họp nào</p>
        <Button
          variant="outline"
          className="mt-4 text-blue-600 border-blue-300 hover:bg-blue-50"
          onClick={onAddMeeting}
        >
          <Link className="h-4 w-4 mr-2" />
          Gắn phiên họp vào kỷ yếu
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {meetings.map((m) => (
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
            onClick={() => onRemoveMeeting(m.id)}
          >
            <Unlink className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
