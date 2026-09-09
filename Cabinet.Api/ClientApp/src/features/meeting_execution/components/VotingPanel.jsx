import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { meetingExecutionApi } from '../api/meetingExecutionApi'
import { Vote, Plus, X } from 'lucide-react'

export function VotingPanel({ meetingId, polls, role }) {
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState(['', ''])

  const handleCreatePoll = async () => {
    if (!title || options.some(o => !o)) return
    await meetingExecutionApi.createPoll(meetingId, { title, options })
    setShowCreate(false)
    setTitle('')
    setOptions(['', ''])
  }

  const handleVote = async (pollId, optionId) => {
    await meetingExecutionApi.castVote(meetingId, pollId, optionId)
  }

  const handleToggleStatus = async (pollId, currentStatus) => {
    const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open'
    await meetingExecutionApi.updatePollStatus(meetingId, pollId, newStatus)
  }

  return (
    <div className="flex flex-col gap-4 border rounded-md p-4 bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Vote className="w-5 h-5 text-purple-500" />
          Biểu quyết trực tiếp
        </h3>
        {(role === 'Admin' || role === 'LanhDao') && (
          <Button size="sm" onClick={() => setShowCreate(!showCreate)} variant="outline">
            {showCreate ? 'Hủy' : 'Tạo biểu quyết'}
          </Button>
        )}
      </div>

      {showCreate && (
        <div className="flex flex-col gap-2 p-3 bg-muted rounded-md mb-2 border">
          <Input placeholder="Câu hỏi biểu quyết..." value={title} onChange={(e) => setTitle(e.target.value)} />
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input placeholder={`Lựa chọn ${i + 1}`} value={opt} onChange={(e) => {
                const newOpts = [...options]
                newOpts[i] = e.target.value
                setOptions(newOpts)
              }} />
              {options.length > 2 && (
                <Button size="icon" variant="ghost" className="shrink-0" onClick={() => setOptions(options.filter((_, idx) => idx !== i))}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <div className="flex justify-between mt-2">
            <Button size="sm" variant="ghost" onClick={() => setOptions([...options, ''])}>
              <Plus className="w-4 h-4 mr-1" /> Thêm lựa chọn
            </Button>
            <Button size="sm" onClick={handleCreatePoll}>Tạo ngay</Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
        {polls.length === 0 && <p className="text-sm text-muted-foreground">Chưa có biểu quyết nào.</p>}
        {polls.map((poll) => (
          <div key={poll.id} className="border rounded-md p-3 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <p className="font-medium">{poll.title}</p>
              <div className="flex items-center gap-2">
                <Badge variant={poll.status === 'Open' ? 'default' : 'secondary'}>
                  {poll.status === 'Open' ? 'Đang mở' : 'Đã đóng'}
                </Badge>
                {(role === 'Admin' || role === 'LanhDao') && (
                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={() => handleToggleStatus(poll.id, poll.status)}>
                    {poll.status === 'Open' ? 'Đóng' : 'Mở lại'}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {poll.options.map((opt) => {
                const percent = poll.totalVotes > 0 ? Math.round((opt.voteCount / poll.totalVotes) * 100) : 0
                return (
                  <div key={opt.id} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span>{opt.content}</span>
                      <span className="font-semibold">{percent}% ({opt.voteCount})</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                    {poll.status === 'Open' && (
                      <Button size="sm" variant="ghost" className="h-6 mt-1 w-full text-xs border border-dashed" onClick={() => handleVote(poll.id, opt.id)}>
                        Bình chọn
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
