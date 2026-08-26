import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export const AccordionSection = ({
  title,
  count,
  children,
  defaultOpen = false,
  rightAction = null,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div
        className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 px-2 -mx-2 transition-colors rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[#1a202c]">
            {title} {count !== undefined && `(${count})`}
          </h3>
          {rightAction && <div onClick={(e) => e.stopPropagation()}>{rightAction}</div>}
        </div>
        <button className="p-1 text-gray-500 hover:text-gray-700">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {isOpen && <div className="pb-6 pt-2">{children}</div>}
    </div>
  )
}

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative mb-3">
      <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 45L80 45" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 35H70" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        <rect
          x="25"
          y="55"
          width="50"
          height="25"
          rx="2"
          fill="#E2E8F0"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        <path
          d="M35 55V40C35 37.2386 37.2386 35 40 35H60C62.7614 35 65 37.2386 65 40V55"
          fill="white"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        <rect x="42" y="42" width="16" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="42" y="48" width="10" height="3" rx="1.5" fill="#CBD5E1" />
        <circle cx="75" cy="25" r="12" fill="white" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="75" y="28" fontSize="8" fill="#64748B" textAnchor="middle" fontWeight="bold">
          ADO
        </text>
      </svg>
    </div>
    <span className="text-sm font-semibold text-gray-600">Không có dữ liệu</span>
  </div>
)

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatTimeOnly = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export const getDynamicStatus = (meeting) => {
  if (!meeting) return ''
  if (meeting.status === 'Hủy' || meeting.status === 'Hoãn') return meeting.status
  const now = new Date()
  const start = new Date(meeting.startTime)
  const end = new Date(meeting.endTime)
  if (now < start) return 'Sắp diễn ra'
  if (now >= start && now <= end) return 'Đang diễn ra'
  return 'Đã kết thúc'
}

export const getStatusColor = (status) => {
  switch (status) {
    case 'Sắp diễn ra':
      return 'bg-[#e6fcf5] text-[#059669] border-[#a7f3d0]'
    case 'Đang diễn ra':
      return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'Đã kết thúc':
      return 'bg-gray-100 text-gray-600 border-gray-200'
    case 'Hủy':
      return 'bg-red-50 text-red-600 border-red-200'
    case 'Hoãn':
      return 'bg-orange-50 text-orange-600 border-orange-200'
    default:
      return 'bg-[#e6fcf5] text-[#059669] border-[#a7f3d0]'
  }
}

export const getRemainingTimeText = (meeting) => {
  if (!meeting) return ''
  const now = new Date()
  const start = new Date(meeting.startTime)
  const end = new Date(meeting.endTime)
  if (now < start) {
    const diffMs = start - now
    const diffDays = Math.floor(diffMs / 86400000)
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000)
    if (diffDays > 0) return `Còn ${diffDays} ngày ${diffHrs} giờ`
    const diffMins = Math.floor((diffMs % 3600000) / 60000)
    if (diffHrs > 0) return `Còn ${diffHrs} giờ ${diffMins} phút`
    return `Còn ${diffMins} phút`
  }
  if (now >= start && now <= end) return 'Đang diễn ra'
  return 'Hết thời gian!'
}
