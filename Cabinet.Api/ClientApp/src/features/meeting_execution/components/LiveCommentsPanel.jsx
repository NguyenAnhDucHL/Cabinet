import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { meetingExecutionApi } from '../api/meetingExecutionApi'
import { MessageSquare, Send } from 'lucide-react'

export function LiveCommentsPanel({ meetingId, comments, currentUserId }) {
  const [content, setContent] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [comments])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    await meetingExecutionApi.addComment(meetingId, content)
    setContent('')
  }

  return (
    <div className="flex flex-col gap-4 border rounded-md p-4 bg-card h-[500px]">
      <h3 className="text-lg font-semibold flex items-center gap-2 shrink-0">
        <MessageSquare className="w-5 h-5 text-green-500" />
        Thảo luận trực tiếp
      </h3>

      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center mt-10">Chưa có bình luận nào.</p>
        )}
        {comments.map((cmt) => {
          const isMe = cmt.userId === currentUserId
          return (
            <div
              key={cmt.id}
              className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <span className="text-xs text-muted-foreground mb-1 px-1">
                {isMe ? 'Bạn' : cmt.userName}
              </span>
              <div
                className={`px-3 py-2 rounded-lg text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}
              >
                {cmt.content}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1">
                {new Date(cmt.createdAt).toLocaleTimeString()}
              </span>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 shrink-0 mt-2">
        <Input
          placeholder="Nhập ý kiến..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!content.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
