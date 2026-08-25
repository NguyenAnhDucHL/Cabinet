import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { SCHEDULE_SIDEBAR, ROOMS_SIDEBAR, MEETINGS_SIDEBAR } from '../../constants/navigation'

export function AppSidebar({ activeNav, activeSidebar, setActiveSidebar }) {
  const hasSidebar =
    activeNav === 'schedule' || activeNav === 'rooms' || activeNav === 'manage_meetings'

  if (!hasSidebar) return null

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm z-10">
      {activeNav === 'schedule' &&
        SCHEDULE_SIDEBAR.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActiveSidebar(i)}
            className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-left border-b border-gray-100 transition-colors ${
              activeSidebar === i
                ? 'bg-[#c8102e] text-white'
                : 'text-gray-700 hover:bg-red-50 hover:text-[#c8102e]'
            }`}
          >
            <item.icon size={16} className="shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}

      {activeNav === 'rooms' &&
        ROOMS_SIDEBAR.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActiveSidebar(i)}
            className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-left border-b border-gray-100 transition-colors ${
              activeSidebar === i
                ? 'bg-[#c8102e] text-white'
                : 'text-gray-700 hover:bg-red-50 hover:text-[#c8102e]'
            }`}
          >
            <item.icon size={16} className="shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}

      {activeNav === 'manage_meetings' &&
        MEETINGS_SIDEBAR.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActiveSidebar(i)}
            className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-left border-b border-gray-100 transition-colors ${
              activeSidebar === i
                ? 'bg-[#c8102e] text-white'
                : 'text-gray-700 hover:bg-red-50 hover:text-[#c8102e]'
            }`}
          >
            <item.icon size={16} className="shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}

      {/* Back to main system */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <Button
          variant="outline"
          className="w-full justify-start text-gray-600 hover:text-[#c8102e] hover:bg-red-50 text-sm"
          onClick={() => (window.location.href = '/')}
        >
          <ArrowLeft className="mr-2 size-4" />
          Về hệ thống chính
        </Button>
      </div>
    </aside>
  )
}
