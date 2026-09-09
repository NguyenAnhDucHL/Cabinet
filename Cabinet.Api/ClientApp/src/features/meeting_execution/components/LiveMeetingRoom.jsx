import React from 'react'
import { ArrowLeft, Users, FileText } from 'lucide-react'
import { useMeetingLive } from '../hooks/useMeetingLive'
import { SpeakingQueuePanel } from './SpeakingQueuePanel'
import { VotingPanel } from './VotingPanel'
import { LiveCommentsPanel } from './LiveCommentsPanel'

export function LiveMeetingRoom({ meeting, onBack, currentUserRole, currentUserId }) {
  const { speakRequests, polls, comments, loading } = useMeetingLive(meeting?.id)

  if (!meeting) return null

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      {/* Header */}
      <div className="bg-[#1a202c] text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold">Phòng họp trực tuyến</h1>
            <p className="text-xs text-gray-400">{meeting.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Đang diễn ra
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Content & Speakers */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Live Streaming Placeholder or Document View */}
            <div className="bg-black/90 rounded-xl aspect-video flex items-center justify-center text-white/50 border border-gray-200 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                <p className="text-white font-medium">Màn hình trình chiếu (Minh họa)</p>
                <p className="text-white/70 text-sm">Chủ tọa đang chia sẻ tài liệu: {meeting.documents?.[0]?.name || 'Báo cáo tổng kết'}</p>
              </div>
              <FileText className="w-16 h-16 opacity-20" />
            </div>

            {/* Speaking Queue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <SpeakingQueuePanel meetingId={meeting.id} requests={speakRequests} role={currentUserRole} />
            </div>

            {/* Voting */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <VotingPanel meetingId={meeting.id} polls={polls} role={currentUserRole} />
            </div>

          </div>

          {/* Right Column - Comments & Interactions */}
          <div className="flex flex-col gap-6 h-full">
            
            {/* Live Comments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden">
              <LiveCommentsPanel meetingId={meeting.id} comments={comments} currentUserId={currentUserId} />
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
