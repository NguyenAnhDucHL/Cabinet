import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { User, X, Edit, Image as ImageIcon, LogOut, ChevronDown } from 'lucide-react'

export function ProfileModal({
  isOpen,
  onClose,
  userName,
  userLoginName,
  userLastLogin,
  onLogout,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[450px] p-0 overflow-hidden border-0 rounded-xl bg-white">
        <div className="bg-[#c8102e] text-white pt-10 pb-6 px-6 relative flex flex-col items-center">
          <button
            onClick={() => onClose(false)}
            className="absolute top-4 right-4 text-white hover:opacity-80 outline-none"
          >
            <X size={20} />
          </button>
          <h2 className="absolute top-4 left-6 font-bold text-lg">Hồ sơ cá nhân</h2>

          <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white mb-3 mt-4 overflow-hidden flex items-center justify-center">
            <User size={48} className="text-gray-400" />
          </div>
          <h3 className="font-bold text-xl mb-1">{userName}</h3>
          <p className="text-sm opacity-90">
            {userLastLogin === 'Lần đầu đăng nhập'
              ? userLastLogin
              : `Lần đăng nhập gần nhất ${userLastLogin}`}
          </p>
        </div>

        <div className="p-6">
          <h4 className="font-bold text-[#1a202c] text-base mb-4">Hồ sơ cá nhân</h4>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Tên đăng nhập</span>
              <span className="font-semibold text-[#1a202c]">{userLoginName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Tên đại biểu</span>
              <span className="font-semibold text-[#1a202c]">{userName}</span>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-6" />

          <h4 className="font-bold text-[#1a202c] text-base mb-4">Cài đặt</h4>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between px-2 py-3 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <Edit size={18} className="text-gray-500" />
                <span className="font-medium text-[#1a202c]">Chỉnh sửa hồ sơ</span>
              </div>
              <ChevronDown
                size={18}
                className="text-gray-400 -rotate-90 group-hover:text-gray-600"
              />
            </button>
            <button className="w-full flex items-center justify-between px-2 py-3 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <ImageIcon size={18} className="text-gray-500" />
                <span className="font-medium text-[#1a202c]">Đổi ảnh đại diện</span>
              </div>
              <ChevronDown
                size={18}
                className="text-gray-400 -rotate-90 group-hover:text-gray-600"
              />
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between px-2 py-3 hover:bg-red-50 rounded-lg transition-colors mt-2"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} className="text-[#c8102e]" />
                <span className="font-medium text-[#c8102e]">Đăng xuất</span>
              </div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
