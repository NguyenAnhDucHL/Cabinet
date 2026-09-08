import React from 'react'
import { CloudUpload } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatDateTime, formatTimeOnly, EmptyState } from './MeetingDetailComponents'

export const NotebookModal = ({ isOpen, setIsOpen, meeting }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[1000px] p-0 overflow-hidden gap-0 border-0 rounded-xl">
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-white">
          <DialogTitle className="text-[#1a202c] text-xl font-bold">Sổ tay</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row bg-gray-50/50 p-6 gap-8 h-[70vh] overflow-y-auto">
          <div className="w-full md:w-2/5 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-500">
                Phiên họp <span className="text-red-500">*</span>
              </label>
              <div className="text-[13px] font-bold text-[#1a202c] leading-snug">
                {meeting?.title || 'KHÔNG CÓ TIÊU ĐỀ'}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-500">
                Thời gian <span className="text-red-500">*</span>
              </label>
              <div className="text-[13px] font-bold text-[#1a202c]">
                {formatDateTime(meeting?.startTime)} - {formatTimeOnly(meeting?.endTime)}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-500">
                Phòng họp <span className="text-red-500">*</span>
              </label>
              <div className="text-[13px] font-bold text-[#1a202c]">
                {meeting?.roomName || meeting?.location || 'Chưa cập nhật'}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-500">
                Chủ trì <span className="text-red-500">*</span>
              </label>
              <div className="text-[13px] font-bold text-[#1a202c] leading-snug">
                {meeting?.presider || 'Chưa cập nhật'}
              </div>
            </div>
            <div className="pt-2">
              <table className="w-full text-sm text-left text-gray-600 border-b border-gray-200">
                <thead className="text-[13px] text-[#1a202c] font-bold">
                  <tr>
                    <th className="pb-3 text-center w-16">STT</th>
                    <th className="pb-3 text-center">Nội dung ghi chú</th>
                    <th className="pb-3 text-center w-24">Hành động</th>
                  </tr>
                </thead>
              </table>
              <div className="mt-8 scale-90 origin-top">
                <EmptyState />
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/5 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1a202c]">
                Ghi chú <span className="text-red-500">*</span>
              </label>
              <textarea className="w-full h-48 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1a202c]">Tài liệu đính kèm (0):</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg bg-white p-8 flex flex-col items-center justify-center text-center hover:bg-red-50/30 transition-colors cursor-pointer">
                <CloudUpload size={32} className="text-[var(--color-primary)] mb-3" />
                <div className="text-sm text-gray-700 mb-1">
                  <span className="text-[var(--color-primary)] font-semibold">Chọn file</span> hoặc
                  Kéo thả từ máy tính
                </div>
                <div className="text-xs text-gray-400">
                  Tối đa 50MB, định dạng .doc, .docx, .xls, .xlsx, .txt, .ppt, .pptx, .pdf
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="text-[var(--color-primary)] border-[var(--color-primary)] hover:bg-red-50 font-semibold px-6 rounded-full"
          >
            Hủy bỏ
          </Button>
          <Button className="bg-[var(--color-primary)] hover:bg-[#a50e27] text-white font-semibold px-6 rounded-full">
            Thêm mới
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
