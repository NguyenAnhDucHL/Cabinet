import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function VersionModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden border-0 rounded-xl">
        <DialogHeader className="px-6 py-4 bg-white relative">
          <DialogTitle className="text-[#1a202c] text-xl font-bold">Phiên bản</DialogTitle>
        </DialogHeader>
        <div className="h-3 bg-[#f0f4f8]" />
        <div className="p-8 bg-white space-y-4">
          <div className="flex items-end gap-3 mb-6">
            <span className="text-[40px] leading-none font-bold text-[#1a202c]">1.0</span>
            <span className="text-gray-500 font-medium mb-1">09.07.2026</span>
          </div>

          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 bg-[#9300d3] text-white text-xs font-bold rounded-lg">
              Fixed
            </span>
            <ul className="list-disc list-inside space-y-2 text-[#1a202c]">
              <li className="marker:text-gray-400">Hoàn thiện giao diện theo chuẩn UI</li>
            </ul>
          </div>

          <div className="flex justify-center pt-8 mt-6 border-t border-gray-100">
            <Button
              onClick={() => onClose(false)}
              className="bg-[var(--color-primary)] hover:bg-[#a50e27] text-white px-10 py-2 h-auto rounded-lg font-bold"
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
