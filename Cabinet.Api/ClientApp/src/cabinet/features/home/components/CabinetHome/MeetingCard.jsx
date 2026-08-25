import React from 'react'
import { Video, CalendarClock, MapPin } from 'lucide-react'

export function MeetingCard({ meeting, isOngoing, onJoin }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border mb-2 last:mb-0 transition-all hover:shadow-sm ${
        isOngoing
          ? 'border-green-200 bg-green-50'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <div
        className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isOngoing ? 'bg-green-500' : 'bg-blue-500'
        }`}
      >
        {isOngoing ? (
          <Video size={14} className="text-white" />
        ) : (
          <CalendarClock size={14} className="text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{meeting.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <MapPin size={11} className="text-gray-400 shrink-0" />
          <span className="text-xs text-gray-500 truncate">
            {meeting.roomName || 'Chưa xác định'}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <CalendarClock size={11} className="text-gray-400" />
          <span className="text-xs text-gray-500">
            {meeting.startTime
              ? new Date(meeting.startTime).toLocaleString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                })
              : '--'}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        {isOngoing && (
          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            ĐANG DIỄN RA
          </span>
        )}
        <button
          onClick={() => onJoin(meeting)}
          className="text-xs px-3 py-1.5 bg-[#c8102e] text-white rounded-md hover:bg-[#a50e27] transition shadow-sm font-medium"
        >
          {isOngoing ? 'Vào họp' : 'Chi tiết'}
        </button>
      </div>
    </div>
  )
}
