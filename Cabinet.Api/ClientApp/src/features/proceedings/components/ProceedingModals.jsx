import { Link, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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
            <select
              value={formMeetingId}
              onChange={(e) => setFormMeetingId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition bg-white"
            >
              <option value="">-- Chọn phiên họp --</option>
              {allMeetings.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.title}
                </option>
              ))}
            </select>
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
              className="bg-[var(--color-primary)] hover:bg-[#a50e27] text-white"
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
            <select
              value={addMeetingId}
              onChange={(e) => setAddMeetingId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 focus:border-[var(--color-primary)] transition bg-white"
            >
              <option value="">-- Chọn phiên họp cần gắn --</option>
              {availableMeetings.length === 0 ? (
                <option disabled>Không còn phiên họp nào để gắn</option>
              ) : (
                availableMeetings.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.title}
                  </option>
                ))
              )}
            </select>
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
              disabled={saving || !addMeetingId}
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
