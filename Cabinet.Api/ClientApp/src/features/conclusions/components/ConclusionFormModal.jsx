import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ConclusionFormModal({
  open,
  onOpenChange,
  meetings,
  formMeetingId,
  setFormMeetingId,
  formFileName,
  setFormFileName,
  formDocumentNumber,
  setFormDocumentNumber,
  formDocumentDate,
  setFormDocumentDate,
  formStatus,
  setFormStatus,
  onSubmit,
  saving,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm kết luận sau phiên họp</DialogTitle>
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
            <Label>Tên file kết luận</Label>
            <Input
              placeholder="Tên file kết luận (ví dụ: KL_2025_01.pdf)"
              value={formFileName}
              onChange={(e) => setFormFileName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Số văn bản</Label>
            <Input
              placeholder="Ví dụ: 123/NQ-HĐND"
              value={formDocumentNumber}
              onChange={(e) => setFormDocumentNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Ngày ban hành</Label>
            <Input
              type="date"
              value={formDocumentDate}
              onChange={(e) => setFormDocumentDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select value={formStatus} onValueChange={setFormStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chưa xử lý">Chưa xử lý</SelectItem>
                <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              className="bg-[#c8102e] hover:bg-[#a50e27] text-white"
              onClick={onSubmit}
              disabled={saving || !formMeetingId}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Lưu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
