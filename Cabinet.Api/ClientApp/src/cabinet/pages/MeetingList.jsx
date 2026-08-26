import React, { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { MeetingDetail } from './MeetingDetail'
import { MeetingProgress } from './MeetingProgress'
import { MeetingModal } from '../components/MeetingModal'
import { CabinetMeetingCreate } from './CabinetMeetingCreate'
import { useMeetingList } from '../../features/meetings/hooks/useMeetingList'

import { MeetingStats } from '../../features/meetings/components/MeetingList/MeetingStats'
import { MeetingFilters } from '../../features/meetings/components/MeetingList/MeetingFilters'
import { MeetingTable } from '../../features/meetings/components/MeetingList/MeetingTable'
import { MeetingPagination } from '../../features/meetings/components/MeetingList/MeetingPagination'

export function MeetingList() {
  const { meetings, loading, activeTab, setActiveTab, isAdmin, fetchMeetings, deleteMeeting } =
    useMeetingList()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [showProgress, setShowProgress] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const filteredMeetings = meetings.filter((m) => {
    const matchSearch = m.title?.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchSearch) return false

    if (activeTab === 'prepare') {
      const noDocs =
        !m.programFilePaths || m.programFilePaths === '[]' || m.programFilePaths === 'null'
      return m.status === 'Sắp diễn ra' && noDocs
    }

    // For 'invited' tab, filter out 'all' logic if admin wants only invited (handled by backend though)
    return true
  })
  const paginatedMeetings = filteredMeetings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  if (isCreating) {
    return (
      <CabinetMeetingCreate
        onBack={() => setIsCreating(false)}
        onSaved={() => {
          setIsCreating(false)
          fetchMeetings(activeTab)
        }}
      />
    )
  }

  if (selectedMeeting) {
    if (showProgress)
      return <MeetingProgress meeting={selectedMeeting} onBack={() => setShowProgress(false)} />
    return (
      <MeetingDetail
        meeting={selectedMeeting}
        onBack={() => setSelectedMeeting(null)}
        onViewProgress={() => setShowProgress(true)}
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shrink-0">
        <h1 className="text-xl font-bold text-[#1a202c]">Quản lý phiên họp</h1>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-[#c8102e] hover:bg-[#a50e27] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo phiên họp
            </Button>
          )}
          <Button variant="outline" className="text-[#c8102e] border-[#c8102e] hover:bg-red-50">
            <Download className="w-4 h-4 mr-2" />
            Xuất file
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Sub Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { key: 'invited', label: 'Phiên họp cá nhân được mời' },
              { key: 'prepare', label: 'Phiên họp cần chuẩn bị tài liệu' },
              ...(isAdmin ? [{ key: 'all', label: 'Tất cả phiên họp' }] : []),
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 pb-3 text-center font-semibold text-sm transition-colors border-b-2 ${activeTab === tab.key ? 'border-[#c8102e] text-[#c8102e]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <MeetingStats activeTab={activeTab} meetings={meetings} />

          <MeetingFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            fetchMeetings={fetchMeetings}
          />

          <MeetingTable
            loading={loading}
            paginatedMeetings={paginatedMeetings}
            currentPage={currentPage}
            pageSize={pageSize}
            activeTab={activeTab}
            isAdmin={isAdmin}
            setSelectedMeeting={setSelectedMeeting}
            deleteMeeting={deleteMeeting}
          />

          {!loading && filteredMeetings.length > 0 && (
            <MeetingPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalItems={filteredMeetings.length}
            />
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <MeetingModal
          onClose={() => setIsAddModalOpen(false)}
          onSaved={() => {
            setIsAddModalOpen(false)
            fetchMeetings()
          }}
        />
      )}
    </div>
  )
}
