import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { meetingExecutionApi } from '../api/meetingExecutionApi'
import { Hand } from 'lucide-react'

export function SpeakingQueuePanel({ meetingId, requests, role }) {
  const handleRequestToSpeak = async () => {
    await meetingExecutionApi.requestToSpeak(meetingId)
  }

  const handleUpdateStatus = async (id, status) => {
    await meetingExecutionApi.updateSpeakingRequest(meetingId, id, status)
  }

  return (
    <div className="flex flex-col gap-4 border rounded-md p-4 bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Hand className="w-5 h-5 text-blue-500" />
          Yêu cầu phát biểu
        </h3>
        <Button size="sm" onClick={handleRequestToSpeak} variant="outline">
          Giơ tay phát biểu
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
        {requests.length === 0 && <p className="text-sm text-muted-foreground">Chưa có yêu cầu nào.</p>}
        {requests.map((req) => (
          <div key={req.id} className="flex items-center justify-between p-2 border rounded-md">
            <div>
              <p className="font-medium text-sm">{req.userName}</p>
              <p className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={req.status === 'Pending' ? 'secondary' : req.status === 'Approved' ? 'default' : 'destructive'}>
                {req.status === 'Pending' ? 'Chờ duyệt' : req.status === 'Approved' ? 'Đã duyệt' : 'Từ chối'}
              </Badge>
              {(role === 'Admin' || role === 'LanhDao') && req.status === 'Pending' && (
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-green-600" onClick={() => handleUpdateStatus(req.id, 'Approved')}>✓</Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-red-600" onClick={() => handleUpdateStatus(req.id, 'Rejected')}>✕</Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
