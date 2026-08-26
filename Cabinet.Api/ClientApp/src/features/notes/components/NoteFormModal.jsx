import { useRef } from 'react'
import { Loader2, UploadCloud, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function NoteFormModal({
  open,
  onOpenChange,
  meetings,
  formMeetingId,
  setFormMeetingId,
  formContent,
  setFormContent,
  formFiles,
  setFormFiles,
  onSubmit,
  saving,
}) {
  const fileInputRef = useRef(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm mới ghi chú</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>
              Phiên họp <span className="text-red-500">*</span>
            </Label>
            <Select value={formMeetingId} onValueChange={setFormMeetingId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phiên họp" />
              </SelectTrigger>
              <SelectContent>
                {meetings.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>
              Ghi chú <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Nhập ghi chú"
              rows={6}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tài liệu đính kèm ({formFiles.length}):</Label>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              accept=".doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx,.pdf"
              onChange={(e) => setFormFiles((p) => [...p, ...Array.from(e.target.files)])}
            />
            <div
              className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm font-medium">
                <span className="text-red-500">Chọn file</span> hoặc Kéo thả từ máy tính
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Tối đa 50MB, định dạng .doc, .docx, .xls, .xlsx, .txt, .ppt, .pptx, .pdf
              </p>
            </div>
            {formFiles.length > 0 && (
              <ul className="mt-2 space-y-1">
                {formFiles.map((f, i) => (
                  <li
                    key={f.name}
                    className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded text-sm"
                  >
                    <span className="truncate text-gray-700">{f.name}</span>
                    <button
                      onClick={() => setFormFiles((p) => p.filter((_, idx) => idx !== i))}
                      className="ml-2 text-red-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              className="bg-[#c8102e] hover:bg-[#a50e27] text-white"
              onClick={onSubmit}
              disabled={saving || !formMeetingId || !formContent.trim()}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Lưu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
