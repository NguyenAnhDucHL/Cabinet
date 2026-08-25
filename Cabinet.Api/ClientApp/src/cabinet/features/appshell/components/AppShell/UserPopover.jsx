import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { User, ChevronDown, Settings, Tag, LogOut } from 'lucide-react'

export function UserPopover({
  userName,
  setIsProfileModalOpen,
  setIsThemeModalOpen,
  setIsVersionModalOpen,
  onLogout,
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#a50e27] rounded text-sm transition outline-none">
          <div className="w-6 h-6 rounded-full bg-[#a50e27] flex items-center justify-center border border-white/30">
            <User size={13} />
          </div>
          <span className="max-w-[120px] truncate">{userName}</span>
          <ChevronDown size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 mt-2 shadow-xl border-gray-100 rounded-xl" align="end">
        <div className="flex flex-col py-1">
          <button
            onClick={() => {
              document.body.click() // close popover
              setIsProfileModalOpen(true)
            }}
            className="flex items-center gap-3 px-4 py-3 bg-[#c8102e] text-white hover:bg-[#a50e27] transition-colors text-sm font-semibold"
          >
            <User size={16} />
            <span>Hồ sơ cá nhân</span>
          </button>
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 text-[#1a202c] hover:bg-gray-50 transition-colors text-sm font-bold"
          >
            <Settings size={16} />
            <span>Giao diện</span>
          </button>
          <button
            onClick={() => setIsVersionModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 text-[#1a202c] hover:bg-gray-50 transition-colors text-sm font-bold"
          >
            <Tag size={16} />
            <span>Phiên bản</span>
          </button>
          <div className="h-px bg-gray-100 my-1" />
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 text-[#c8102e] hover:bg-red-50 transition-colors text-sm font-bold"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
