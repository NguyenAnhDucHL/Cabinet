import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function AttendanceConfirmModal({
  confirmMeeting,
  setConfirmMeeting,
  handleConfirmAttendance,
}) {
  return (
    <Dialog open={!!confirmMeeting} onOpenChange={() => setConfirmMeeting(null)}>
      <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-0 rounded-xl shadow-2xl">
        <DialogHeader className="bg-[#c8102e] px-6 py-4">
          <DialogTitle className="text-white text-lg font-bold">Xác nhận điểm danh</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <p className="text-gray-700 text-sm mb-4">
            Bạn có chắc chắn muốn xác nhận điểm danh và tham gia phiên họp{' '}
            <strong>{confirmMeeting?.title}</strong> không?
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50 cursor-pointer"
              onClick={() => setConfirmMeeting(null)}
            >
              Hủy
            </Button>
            <Button
              className="bg-[#c8102e] text-white hover:bg-[#a50e27] cursor-pointer"
              onClick={handleConfirmAttendance}
            >
              Điểm danh & Vào họp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
