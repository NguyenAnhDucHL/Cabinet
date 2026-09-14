import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { meetingExecutionApi } from '../api/meetingExecutionApi'
import { Hand } from 'lucide-react'

export function SpeakingQueuePanel({ meetingId, requests, role }) {
  const [topicModalOpen, setTopicModalOpen] = useState(false)
  const [topic, setTopic] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [approvingReqId, setApprovingReqId] = useState(null)
  const [duration, setDuration] = useState('')

  const handleRequestToSpeak = async () => {
    try {
      setIsSubmitting(true)
      await meetingExecutionApi.requestToSpeak(meetingId, topic)
      setTopicModalOpen(false)
      setTopic('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApproveClick = (id) => {
    setApprovingReqId(id)
    setDuration('')
    setApproveModalOpen(true)
  }

  const handleConfirmApprove = async () => {
    try {
      setIsSubmitting(true)
      const dur = duration ? parseInt(duration, 10) : null
      await meetingExecutionApi.updateSpeakingRequest(meetingId, approvingReqId, 'Approved', dur)
      setApproveModalOpen(false)
      setApprovingReqId(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (id) => {
    await meetingExecutionApi.updateSpeakingRequest(meetingId, id, 'Rejected', null)
  }

  return (
    <div className="flex flex-col gap-4 border rounded-md p-4 bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Hand className="w-5 h-5 text-blue-500" />
          Yêu cầu phát biểu
        </h3>
        <Button size="sm" onClick={() => setTopicModalOpen(true)} variant="outline">
          Giơ tay phát biểu
        </Button>
      </div>

      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
        {requests.length === 0 && (
          <p className="text-sm text-muted-foreground">Chưa có yêu cầu nào.</p>
        )}
        {requests.map((req) => (
          <div key={req.id} className="flex flex-col gap-2 p-2 border rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{req.userName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(req.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    req.status === 'Pending'
                      ? 'secondary'
                      : req.status === 'Approved'
                        ? 'default'
                        : 'destructive'
                  }
                >
                  {req.status === 'Pending'
                    ? 'Chờ duyệt'
                    : req.status === 'Approved'
                      ? 'Đã duyệt'
                      : 'Từ chối'}
                </Badge>
                {(role === 'Admin' || role === 'LanhDao') && req.status === 'Pending' && (
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-green-600"
                      onClick={() => handleApproveClick(req.id)}
                    >
                      ✓
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-red-600"
                      onClick={() => handleReject(req.id)}
                    >
                      ✕
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {req.topic && (
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-sm border">
                <strong>Nội dung:</strong> {req.topic}
              </p>
            )}
            {req.durationMinutes !== null && req.durationMinutes !== undefined && (
              <p className="text-xs text-blue-600 font-medium">
                Thời gian duyệt: {req.durationMinutes} phút
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Xin phát biểu Modal */}
      <Dialog open={topicModalOpen} onOpenChange={setTopicModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giơ tay phát biểu</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">Nội dung phát biểu (không bắt buộc)</Label>
              <Input
                id="topic"
                placeholder="Nhập nội dung bạn muốn trình bày..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTopicModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleRequestToSpeak} disabled={isSubmitting}>
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duyệt phát biểu Modal */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duyệt yêu cầu phát biểu</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Thời gian cấp (phút)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="Nhập số phút (không bắt buộc)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmApprove} disabled={isSubmitting}>
              Duyệt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
