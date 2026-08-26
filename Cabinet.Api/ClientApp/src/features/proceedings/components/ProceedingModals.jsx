import { Link, Loader2 } from 'lucide-react'
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

export function ProceedingCreateModal({
  open,
  onOpenChange,
  allMeetings,
  formName,
  setFormName,
  formDesc,
  setFormDesc,
  formMeetingId,
  setFormMeetingId,
  onSubmit,
  saving,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy bỏ
            </Button>
            <Button
              className="bg-[#c8102e] hover:bg-[#a50e27] text-white"
              onClick={onSubmit}
              disabled={saving || !formName.trim()}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Thêm mới
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ProceedingAddMeetingModal({
  open,
  onOpenChange,
  selectedProceedingName,
  availableMeetings,
  addMeetingId,
  setAddMeetingId,
  onSubmit,
  saving,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Gắn phiên họp vào kỷ yếu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <p className="text-sm text-gray-500">
            Kỷ yếu: <span className="font-semibold text-slate-800">{selectedProceedingName}</span>
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
                onOpenChange(false)
                setAddMeetingId('')
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onSubmit}
              disabled={saving || !addMeetingId || addMeetingId === '__none__'}
            >
              {saving ? (
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
  )
}
