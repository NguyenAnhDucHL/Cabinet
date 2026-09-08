import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function AttendanceConfirmModal({
  confirmMeeting,
  setConfirmMeeting,
  handleConfirmAttendance,
}) {
  const [selectedStatus, setSelectedStatus] = useState('Có tham gia')

  return (
    <Dialog open={!!confirmMeeting} onOpenChange={() => setConfirmMeeting(null)}>
      <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-0 rounded-xl shadow-2xl">
        <DialogHeader className="bg-[var(--color-primary)] px-6 py-4">
          <DialogTitle className="text-white text-lg font-bold">Xác nhận tham gia</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="flex flex-col gap-4 mb-6 mt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="attendanceStatus"
                value="Có tham gia"
                checked={selectedStatus === 'Có tham gia'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
              />
              <span className="text-gray-800 font-medium">Tham gia</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="attendanceStatus"
                value="Vắng mặt"
                checked={selectedStatus === 'Vắng mặt'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
              />
              <span className="text-gray-800 font-medium">Báo vắng</span>
            </label>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              className="text-[var(--color-primary)] border-[var(--color-primary)] bg-white hover:bg-gray-50 min-w-[120px] rounded-full px-6 py-2 h-auto text-base"
              onClick={() => setConfirmMeeting(null)}
            >
              Hủy bỏ
            </Button>
            <Button
              className="bg-[var(--color-primary)] text-white hover:bg-[#a50e27] min-w-[120px] rounded-full px-6 py-2 h-auto text-base shadow-md transition-transform active:scale-95"
              onClick={() => handleConfirmAttendance(selectedStatus)}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
