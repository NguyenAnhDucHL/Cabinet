import React, { useState, useEffect } from 'react'
import { Loader2, FileText } from 'lucide-react'
import { CabinetHome } from './pages/CabinetHome'
import { CabinetSchedule } from './pages/CabinetSchedule'
import { CabinetRooms } from './pages/CabinetRooms'
import { CabinetQuestionnaire } from './pages/CabinetQuestionnaire'
import { CabinetMeetings } from './pages/CabinetMeetings'
import { CabinetLibrary } from './pages/CabinetLibrary'
import { NAV_ITEMS, SCHEDULE_SIDEBAR } from '../features/appshell/constants/navigation'
import { TopNavigation } from '../features/appshell/components/AppShell/TopNavigation'
import { AppSidebar } from '../features/appshell/components/AppShell/AppSidebar'
import { ProfileModal } from '../features/appshell/components/AppShell/ProfileModal'
import { ThemeModal } from '../features/appshell/components/AppShell/ThemeModal'
import { VersionModal } from '../features/appshell/components/AppShell/VersionModal'
import { Users } from '../pages/Users'

export function CabinetAppShell({ children }) {
  const [activeNav, setActiveNav] = useState('home')
  const [activeSidebar, setActiveSidebar] = useState(0)

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [userName, setUserName] = useState('Người dùng')
  const [userLoginName, setUserLoginName] = useState('022182002686')
  const [userLastLogin, setUserLastLogin] = useState('Lần đầu đăng nhập')

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [notifications, setNotifications] = useState([])
  const [notifCount, setNotifCount] = useState(0)

  useEffect(() => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        const payload = JSON.parse(window.atob(token.split('.')[1]))
        setUserName(
          payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
            payload.unique_name ||
            payload.sub ||
            'Người dùng'
        )
        setUserLoginName(
          payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
            payload.unique_name ||
            '022182002686'
        )
        setUserLastLogin(payload.LastLogin || 'Lần đầu đăng nhập')
      }
    } catch {
      /* silent */
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notification')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        setNotifCount(data.filter((n) => !n.isRead).length)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const markAllRead = async () => {
    try {
      await fetch('/api/notification/mark-all-read', { method: 'POST' })
      fetchNotifications()
    } catch (e) {
      console.error(e)
    }
  }

  const markRead = async (id) => {
    try {
      await fetch(`/api/notification/mark-read/${id}`, { method: 'POST' })
      fetchNotifications()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const handleNotifUpdate = () => fetchNotifications()
    document.addEventListener('realtime:notifications_updated', handleNotifUpdate)
    return () => {
      document.removeEventListener('realtime:notifications_updated', handleNotifUpdate)
    }
  }, [])

  const handleLogout = () => {
    setIsProfileModalOpen(false)
    setIsLoggingOut(true)
    setTimeout(() => {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }, 1500)
  }

  const currentScheduleType = SCHEDULE_SIDEBAR[activeSidebar]?.type || 'personal'

  const renderPage = () => {
    switch (activeNav) {
      case 'home':
        return <CabinetHome />
      case 'schedule':
        return <CabinetSchedule scheduleType={currentScheduleType} />
      case 'manage_meetings':
        return <CabinetMeetings activeTab={activeSidebar} />
      case 'rooms':
        return <CabinetRooms />
      case 'questionnaire':
        return <CabinetQuestionnaire />
      case 'library':
        return <CabinetLibrary activeTab={activeSidebar} />
      case 'admin':
        return <Users />
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
              <FileText size={28} className="opacity-25" />
            </div>
            <h3 className="text-base font-bold text-gray-600 mb-1">Đang phát triển</h3>
            <p className="text-sm">
              Tính năng &quot;{NAV_ITEMS.find((x) => x.id === activeNav)?.label}&quot; sẽ sớm được
              cập nhật.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 font-sans">
      <TopNavigation
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        setActiveSidebar={setActiveSidebar}
        notifCount={notifCount}
        notifications={notifications}
        markAllRead={markAllRead}
        markRead={markRead}
        userName={userName}
        setIsProfileModalOpen={setIsProfileModalOpen}
        setIsThemeModalOpen={setIsThemeModalOpen}
        setIsVersionModalOpen={setIsVersionModalOpen}
        onLogout={handleLogout}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          activeNav={activeNav}
          activeSidebar={activeSidebar}
          setActiveSidebar={setActiveSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 bg-gray-50 overflow-hidden relative flex flex-col">
          {children || renderPage()}
        </main>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={setIsProfileModalOpen}
        userName={userName}
        userLoginName={userLoginName}
        userLastLogin={userLastLogin}
        onLogout={handleLogout}
      />

      <ThemeModal isOpen={isThemeModalOpen} onClose={setIsThemeModalOpen} />

      <VersionModal isOpen={isVersionModalOpen} onClose={setIsVersionModalOpen} />

      {isLoggingOut && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
          <h2 className="text-white text-xl font-bold">Đang đăng xuất...</h2>
          <p className="text-gray-200 mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      )}
    </div>
  )
}
