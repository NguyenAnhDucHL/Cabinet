import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Bell } from 'lucide-react'

export function NotificationsPopover({ notifCount, notifications, markAllRead, markRead }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 hover:bg-[#a50e27] rounded-full relative transition outline-none">
          <Bell size={17} />
          {notifCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border border-white px-1 shadow-sm">
              {notifCount > 99 ? '99+' : notifCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0 mr-4 mt-2 shadow-xl border-gray-100 rounded-xl"
        align="end"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white rounded-t-xl">
          <h3 className="font-bold text-[#1a202c] text-lg">Thông báo</h3>
          <button
            onClick={markAllRead}
            className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto flex flex-col">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">Không có thông báo nào.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex gap-3 px-4 py-3 border-b border-gray-100 transition cursor-pointer relative ${
                  n.isRead ? 'bg-white hover:bg-gray-50' : 'bg-[#eff6ff] hover:bg-[#e0f2fe]'
                }`}
              >
                <div className="flex-1 space-y-1">
                  <p
                    className={`text-sm leading-snug pr-4 ${
                      n.isRead ? 'text-gray-600' : 'text-[#1a202c] font-medium'
                    }`}
                  >
                    {n.title && <span className="font-bold mr-1 block">{n.title}</span>}
                    {n.body}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                {!n.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 absolute right-4 top-1/2 -translate-y-1/2" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
