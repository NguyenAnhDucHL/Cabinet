import { useState, useEffect } from 'react'
import { meetingExecutionApi } from '../api/meetingExecutionApi'
import { signalRService } from '@/lib/signalr'

export function useMeetingLive(meetingId) {
  const [speakRequests, setSpeakRequests] = useState([])
  const [polls, setPolls] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!meetingId) return

    const loadInitialData = async () => {
      setLoading(true)
      try {
        const [reqRes, pollRes, cmtRes] = await Promise.all([
          meetingExecutionApi.getSpeakingRequests(meetingId),
          meetingExecutionApi.getPolls(meetingId),
          meetingExecutionApi.getComments(meetingId),
        ])
        setSpeakRequests(reqRes.data || [])
        setPolls(pollRes.data || [])
        setComments(cmtRes.data || [])
      } catch (err) {
        console.error('Failed to load meeting execution data', err)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()

    // Join signalR group
    signalRService.joinMeetingGroup(meetingId)

    // Setup event listeners
    const handleNewSpeak = (e) => setSpeakRequests((prev) => [...prev, e.detail])
    const handleUpdateSpeak = (e) =>
      setSpeakRequests((prev) => prev.map((r) => (r.id === e.detail.id ? e.detail : r)))
    const handleNewPoll = (e) => setPolls((prev) => [e.detail, ...prev])
    const handleUpdatePoll = (e) =>
      setPolls((prev) => prev.map((p) => (p.id === e.detail.id ? e.detail : p)))
    const handleNewComment = (e) => setComments((prev) => [...prev, e.detail])

    document.addEventListener('live:new_speaking_request', handleNewSpeak)
    document.addEventListener('live:speaking_request_updated', handleUpdateSpeak)
    document.addEventListener('live:new_poll', handleNewPoll)
    document.addEventListener('live:poll_updated', handleUpdatePoll)
    document.addEventListener('live:new_comment', handleNewComment)

    return () => {
      document.removeEventListener('live:new_speaking_request', handleNewSpeak)
      document.removeEventListener('live:speaking_request_updated', handleUpdateSpeak)
      document.removeEventListener('live:new_poll', handleNewPoll)
      document.removeEventListener('live:poll_updated', handleUpdatePoll)
      document.removeEventListener('live:new_comment', handleNewComment)
      signalRService.leaveMeetingGroup(meetingId)
    }
  }, [meetingId])

  return { speakRequests, polls, comments, loading, setSpeakRequests, setPolls, setComments }
}
