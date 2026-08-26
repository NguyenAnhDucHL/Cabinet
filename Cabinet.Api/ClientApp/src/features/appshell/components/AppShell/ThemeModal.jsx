import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export function ThemeModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden border-0 rounded-xl">
        <DialogHeader className="px-6 py-4 bg-white relative">
          <DialogTitle className="text-[#1a202c] text-xl font-bold">
            Thay đổi màu sắc giao diện
          </DialogTitle>
        </DialogHeader>
        <div className="h-3 bg-[#f0f4f8]" />
        <div className="p-6 bg-white">
          <p className="text-sm text-gray-500 italic mb-8">
            Chọn màu bên dưới để thay đổi màu sắc giao diện.
          </p>
          <div className="flex flex-col sm:flex-row gap-12 items-start justify-center">
            <label className="flex items-start gap-3 cursor-pointer group w-[140px]">
              <div className="w-6 h-6 shrink-0 rounded bg-[#c8102e] flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
              <span className="text-[#c8102e] font-medium group-hover:text-[#a50e27] transition-colors leading-tight">
                Đỏ Rouge
                <br />
                Écarlate
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group w-[140px]">
              <div className="w-6 h-6 shrink-0 rounded bg-[#004282] border border-gray-200" />
              <span className="text-[#004282] font-medium group-hover:text-[#002f5e] transition-colors leading-tight">
                Xanh Dark
                <br />
                Cerulean
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group w-[140px]">
              <div className="w-6 h-6 shrink-0 rounded bg-[#0061ff] border border-gray-200" />
              <span className="text-[#0061ff] font-medium group-hover:text-[#004bcc] transition-colors leading-tight">
                Xanh
                <br />
                Brandeis
              </span>
            </label>
          </div>
          <div className="flex justify-center pt-10">
            <Button
              onClick={() => onClose(false)}
              className="bg-[#c8102e] hover:bg-[#a50e27] text-white px-8 py-2 h-auto rounded-lg font-bold"
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
