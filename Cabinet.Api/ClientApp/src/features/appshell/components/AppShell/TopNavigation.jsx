import React from 'react'
import { Menu, ArrowLeft } from 'lucide-react'
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
    <header className="bg-[#c8102e] text-white flex items-center h-14 shrink-0 shadow-md z-20">
      <CabinetLogo
        onClick={() => {
          setActiveNav('home')
          setActiveSidebar(0)
        }}
      />

      <button
        className="px-3 h-full flex items-center hover:bg-[#a50e27] transition"
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
              activeNav === item.id
                ? 'bg-[#a50e27] border-white'
                : 'border-transparent hover:bg-[#a50e27]/70'
            }`}
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

        <div className="w-px h-7 bg-[#a50e27] mx-1" />

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
