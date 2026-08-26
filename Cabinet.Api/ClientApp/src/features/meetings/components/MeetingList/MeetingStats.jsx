import React from 'react'
import { UserCheck, User, UserX, FileText } from 'lucide-react'
import { ATTENDANCE_STATUS } from '../../../../constants/meeting'

export function MeetingStats({ activeTab, meetings }) {
  if (activeTab === 'all') return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {activeTab === 'invited' ? (
        <>
          <div className="bg-[#e6fcf5] border border-[#a7f3d0] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center text-white shrink-0">
              <UserCheck size={24} />
            </div>
            <div>
              <div className="text-gray-600 font-medium text-sm mb-1">Tham gia</div>
              <div className="text-2xl font-bold text-gray-900">
                {meetings.filter((m) => m.attendanceStatus === ATTENDANCE_STATUS.JOINED).length}
              </div>
            </div>
          </div>
          <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center text-white shrink-0">
              <User size={24} />
            </div>
            <div>
              <div className="text-gray-600 font-medium text-sm mb-1">Chưa xác nhận</div>
              <div className="text-2xl font-bold text-gray-900">
                {
                  meetings.filter(
                    (m) => m.attendanceStatus === ATTENDANCE_STATUS.PENDING || !m.attendanceStatus
                  ).length
                }
              </div>
            </div>
          </div>
          <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#e11d48] flex items-center justify-center text-white shrink-0">
              <UserX size={24} />
            </div>
            <div>
              <div className="text-gray-600 font-medium text-sm mb-1">Vắng mặt</div>
              <div className="text-2xl font-bold text-gray-900">
                {meetings.filter((m) => m.attendanceStatus === ATTENDANCE_STATUS.ABSENT).length}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-[#e6fcf5] border border-[#a7f3d0] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center text-white shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-gray-600 font-medium text-sm mb-1">Đã xử lý</div>
              <div className="text-2xl font-bold text-gray-900">
                {meetings.filter((m) => m.attendanceStatus === ATTENDANCE_STATUS.PROCESSED).length}
              </div>
            </div>
          </div>
          <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center text-white shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-gray-600 font-medium text-sm mb-1">Chưa xử lý</div>
              <div className="text-2xl font-bold text-gray-900">
                {
                  meetings.filter((m) => m.attendanceStatus === ATTENDANCE_STATUS.UNPROCESSED)
                    .length
                }
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
