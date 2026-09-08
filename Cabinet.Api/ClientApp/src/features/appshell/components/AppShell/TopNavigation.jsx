import React from 'react'
import { Menu } from 'lucide-react'
import { CabinetLogo } from './CabinetLogo'
import { NotificationsPopover } from './NotificationsPopover'
import { UserPopover } from './UserPopover'
import { NAV_ITEMS } from '../../constants/navigation'

export function TopNavigation({
  activeNav,
  setActiveNav,
  setActiveSidebar,
  notifCount,
  notifications,
  markAllRead,
  markRead,
  userName,
  setIsProfileModalOpen,
  setIsThemeModalOpen,
  setIsVersionModalOpen,
  onLogout,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) {
  return (
    <header
      className="text-white flex items-center h-14 shrink-0 shadow-md z-20"
      style={{ background: 'var(--color-primary, #c8102e)' }}
    >
      <CabinetLogo
        onClick={() => {
          setActiveNav('home')
          setActiveSidebar(0)
        }}
      />

      <button
        className="px-3 h-full flex items-center transition"
        style={{ '--tw-hover-bg': 'var(--color-sidebar-mid, #a50d25)' }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'var(--color-sidebar-mid, #a50d25)')
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = '')}
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <Menu size={20} />
      </button>

      <nav className="flex items-center h-full flex-1 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveNav(item.id)
              setActiveSidebar(0)
            }}
            className={`flex items-center gap-1.5 px-4 h-full text-sm font-medium whitespace-nowrap transition border-b-2 shrink-0 ${
              activeNav === item.id ? 'border-white' : 'border-transparent'
            }`}
            style={{
              background: activeNav === item.id ? 'var(--color-sidebar-mid, #a50d25)' : undefined,
            }}
            onMouseEnter={(e) => {
              if (activeNav !== item.id)
                e.currentTarget.style.background = 'var(--color-sidebar-mid, #a50d25)'
            }}
            onMouseLeave={(e) => {
              if (activeNav !== item.id) e.currentTarget.style.background = ''
            }}
          >
            <item.icon size={14} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-0.5 px-3 shrink-0">
        <NotificationsPopover
          notifCount={notifCount}
          notifications={notifications}
          markAllRead={markAllRead}
          markRead={markRead}
        />

        <div
          className="w-px h-7 mx-1"
          style={{ background: 'var(--color-sidebar-mid, #a50d25)' }}
        />

        <UserPopover
          userName={userName}
          setIsProfileModalOpen={setIsProfileModalOpen}
          setIsThemeModalOpen={setIsThemeModalOpen}
          setIsVersionModalOpen={setIsVersionModalOpen}
          onLogout={onLogout}
        />
      </div>
    </header>
  )
}
