import React, { useState } from 'react'
import { LibraryLayout } from '../../features/documents/components/LibraryLayout'
import { LIBRARY_SIDEBAR } from '../../features/appshell/constants/navigation'

export function CabinetLibrary({ activeTab }) {
  const currentTab = LIBRARY_SIDEBAR[activeTab] || LIBRARY_SIDEBAR[0]

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <h1 className="text-xl font-bold text-gray-800">{currentTab.label}</h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <LibraryLayout type={currentTab.type} label={currentTab.label} />
      </div>
    </div>
  )
}
