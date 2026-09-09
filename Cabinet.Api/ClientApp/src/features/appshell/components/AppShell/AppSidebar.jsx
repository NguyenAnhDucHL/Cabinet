import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import {
  SCHEDULE_SIDEBAR,
  ROOMS_SIDEBAR,
  MEETINGS_SIDEBAR,
  LIBRARY_SIDEBAR,
  ADMIN_SIDEBAR,
} from '../../constants/navigation'

const SIDEBAR_MAPS = {
  schedule: SCHEDULE_SIDEBAR,
  rooms: ROOMS_SIDEBAR,
  manage_meetings: MEETINGS_SIDEBAR,
  library: LIBRARY_SIDEBAR,
  admin: ADMIN_SIDEBAR,
}

function SidebarItem({ item, index, activeSidebar, setActiveSidebar, isSidebarCollapsed }) {
  const isActive = activeSidebar === index
  return (
    <button
      onClick={() => setActiveSidebar(index)}
      className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-left border-b border-gray-100 transition-all ${
        isSidebarCollapsed ? 'justify-center' : ''
      }`}
      style={
        isActive
          ? {
              background: 'var(--color-primary, #c8102e)',
              color: '#ffffff',
            }
          : {}
      }
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background =
            'color-mix(in srgb, var(--color-primary, #c8102e) 8%, transparent)'
          e.currentTarget.style.color = 'var(--color-primary, #c8102e)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = ''
          e.currentTarget.style.color = ''
        }
      }}
      title={isSidebarCollapsed ? item.label : undefined}
    >
      <item.icon size={20} className="shrink-0" />
      {!isSidebarCollapsed && <span>{item.label}</span>}
    </button>
  )
}

export function AppSidebar({
  activeNav,
  activeSidebar,
  setActiveSidebar,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) {
  const items = SIDEBAR_MAPS[activeNav]
  if (!items) return null

  return (
    <aside
      className={`${isSidebarCollapsed ? 'w-16' : 'w-56'} bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm z-10 transition-all duration-300 overflow-hidden`}
    >
      <button
        onClick={() => setIsSidebarCollapsed && setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100 transition-all ${
          isSidebarCollapsed ? 'justify-center' : ''
        }`}
        title={isSidebarCollapsed ? 'Mở rộng Menu' : 'Thu gọn Menu'}
      >
        <div className="shrink-0 size-5 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </div>
        {!isSidebarCollapsed && <span className="text-sm font-medium">Thu gọn Menu</span>}
      </button>
      {items.map((item, i) => (
        <SidebarItem
          key={item.label}
          item={item}
          index={i}
          activeSidebar={activeSidebar}
          setActiveSidebar={setActiveSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      ))}

      {/* Back to main system */}
      <div
        className={`mt-auto p-4 border-t border-gray-100 ${isSidebarCollapsed ? 'flex justify-center px-2' : ''}`}
      >
        <Button
          variant="outline"
          className={`w-full text-gray-600 text-sm ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-start'}`}
          style={{
            '--hover-color': 'var(--color-primary, #c8102e)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-primary, #c8102e)'
            e.currentTarget.style.background =
              'color-mix(in srgb, var(--color-primary, #c8102e) 6%, transparent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = ''
            e.currentTarget.style.background = ''
          }}
          onClick={() => (window.location.href = '/')}
          title={isSidebarCollapsed ? 'Về hệ thống chính' : undefined}
        >
          <ArrowLeft className={isSidebarCollapsed ? 'size-5' : 'mr-2 size-4'} />
          {!isSidebarCollapsed && 'Về hệ thống chính'}
        </Button>
      </div>
    </aside>
  )
}
