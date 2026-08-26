import { useState } from 'react'
import { ATTENDANCE_STATUS } from '../../constants/meeting'
import { StatRow } from '../../features/home/components/CabinetHome/StatRow'
import { MeetingCard } from '../../features/home/components/CabinetHome/MeetingCard'
import { EmptyState } from '../../features/home/components/CabinetHome/EmptyState'
import { SectionCard } from '../../features/home/components/CabinetHome/SectionCard'
import { MonthPicker } from '../../features/home/components/CabinetHome/MonthPicker'
import { AttendanceConfirmModal } from '../../features/home/components/CabinetHome/AttendanceConfirmModal'
import { useCabinetHome } from '../../features/home/hooks/useCabinetHome'

export function CabinetHome() {
  const d = new Date()
  const [selectedMonth, setSelectedMonth] = useState(d.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(d.getFullYear())

  const {
    ongoingMeetings,
    upcomingMeetings,
    unconfirmedMeetings,
    unansweredQuestions,
    stats,
    loading,
    confirmMeeting,
    setConfirmMeeting,
    handleJoinMeeting,
    handleConfirmAttendance,
  } = useCabinetHome(selectedMonth, selectedYear)

  const attended = stats.total > 0 ? (stats.attended / stats.total) * 100 : 0
  const pending = stats.total > 0 ? (stats.pending / stats.total) * 100 : 0
  const absent = stats.total > 0 ? (stats.absent / stats.total) * 100 : 0

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a202c]">Trang chủ</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan tình trạng họp và phiên họp diễn ra</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Thống kê tình trạng tham gia họp */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-[#1a202c] text-lg">Thống kê tình trạng tham gia họp</h2>
              <MonthPicker
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onChange={(m, y) => {
                  setSelectedMonth(m)
                  setSelectedYear(y)
                }}
              />
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                  {stats.total > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      strokeWidth="6"
                      strokeDasharray={`${attended} ${100 - attended}`}
                      strokeLinecap="butt"
                      style={{ stroke: '#2dd4bf' }}
                    />
                  )}
                </svg>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#1a202c] mb-3 px-1">
                <span>Trạng thái</span>
                <div className="flex gap-6">
                  <span className="w-12 text-right">Giá trị</span>
                  <span className="w-16 text-right">Tỷ lệ (%)</span>
                </div>
              </div>
              <StatRow
                color="bg-[#2dd4bf]"
                label="Có tham gia"
                value={stats.attended}
                percent={attended}
              />
              <StatRow
                color="bg-orange-400"
                label="Chưa xác nhận tham gia"
                value={stats.pending}
                percent={pending}
              />
              <StatRow
                color="bg-[#fb7185]"
                label="Đã báo vắng"
                value={stats.absent}
                percent={absent}
              />
            </div>
          </div>

          {/* Phiên họp cần chuẩn bị tài liệu */}
          <div>
            <h3 className="font-bold text-[#1a202c] mb-3">Phiên họp cần chuẩn bị tài liệu (0)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#e6fbf1] rounded-lg p-5 text-center shadow-sm">
                <p className="text-sm font-bold text-[#1a202c] mb-2">Đã chuẩn bị</p>
                <p className="text-3xl font-bold text-[#1a202c]">0</p>
              </div>
              <div className="bg-[#fef8e6] rounded-lg p-5 text-center shadow-sm">
                <p className="text-sm font-bold text-[#1a202c] mb-2">Chưa chuẩn bị</p>
                <p className="text-3xl font-bold text-[#1a202c]">0</p>
              </div>
            </div>
          </div>

          {/* Tổng số phiếu lấy ý kiến */}
          <div>
            <h3 className="font-bold text-[#1a202c] mb-3">Tổng số phiếu lấy ý kiến (0)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#e6fbf1] rounded-lg p-5 text-center shadow-sm">
                <p className="text-sm font-bold text-[#1a202c] mb-2">Đã trả lời</p>
                <p className="text-3xl font-bold text-[#1a202c]">0</p>
              </div>
              <div className="bg-[#fef8e6] rounded-lg p-5 text-center shadow-sm">
                <p className="text-sm font-bold text-[#1a202c] mb-2">Chưa trả lời</p>
                <p className="text-3xl font-bold text-[#1a202c]">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          <SectionCard title="Phiên họp đang diễn ra" count={ongoingMeetings.length}>
            {loading ? (
              <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ) : ongoingMeetings.length === 0 ? (
              <EmptyState />
            ) : (
              ongoingMeetings.map((m) => (
                <MeetingCard key={m.id} meeting={m} isOngoing={true} onJoin={handleJoinMeeting} />
              ))
            )}
          </SectionCard>

          <SectionCard
            title="Phiên họp sắp diễn ra"
            count={upcomingMeetings.length}
            showAction={true}
          >
            {loading ? (
              <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ) : upcomingMeetings.length === 0 ? (
              <EmptyState />
            ) : (
              upcomingMeetings.map((m) => (
                <MeetingCard key={m.id} meeting={m} isOngoing={false} onJoin={handleJoinMeeting} />
              ))
            )}
          </SectionCard>

          <SectionCard title="Phiên họp chưa xác nhận" count={unconfirmedMeetings.length}>
            {unconfirmedMeetings.length === 0 ? <EmptyState /> : <div>Data here</div>}
          </SectionCard>

          <SectionCard title="Phiếu lấy ý kiến chưa trả lời" count={unansweredQuestions.length}>
            {unansweredQuestions.length === 0 ? <EmptyState /> : <div>Data here</div>}
          </SectionCard>
        </div>

        {/* Điểm danh Modal */}
        <AttendanceConfirmModal
          confirmMeeting={confirmMeeting}
          setConfirmMeeting={setConfirmMeeting}
          handleConfirmAttendance={handleConfirmAttendance}
        />
      </div>
    </div>
  )
}
