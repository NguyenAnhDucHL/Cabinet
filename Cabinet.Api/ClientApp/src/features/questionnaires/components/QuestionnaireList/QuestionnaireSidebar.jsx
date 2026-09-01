import React from 'react'
import { FileText, Inbox } from 'lucide-react'

export function QuestionnaireSidebar({ activeSidebar, setActiveSidebar, setMode }) {
  const sideNavItems = [
    { id: 'list', label: 'Danh sách phiếu', icon: FileText },
    { id: 'my', label: 'Phiếu nhận được', icon: Inbox },
    { id: 'template', label: 'Mẫu phiếu lấy ý kiến', icon: FileText },
  ]

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
      {sideNavItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setActiveSidebar(item.id)
            setMode('list')
          }}
          className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${
            activeSidebar === item.id
              ? 'border-[#c8102e] text-[#c8102e] bg-red-50/50'
              : 'border-transparent text-gray-600 hover:bg-gray-50'
          }`}
        >
          <item.icon size={18} />
          {item.label}
        </button>
      ))}
    </div>
  )
}
