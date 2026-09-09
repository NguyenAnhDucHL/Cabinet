// API calls for meeting execution

const BASE_URL = '/api/phonghopkhonggiayto/execution/meetings'

export const meetingExecutionApi = {
  // Speaking Requests
  getSpeakingRequests: (meetingId) =>
    fetch(`${BASE_URL}/${meetingId}/speak-requests`).then((r) => r.json()),
  requestToSpeak: (meetingId) =>
    fetch(`${BASE_URL}/${meetingId}/speak-requests`, { method: 'POST' }).then((r) => r.json()),
  updateSpeakingRequest: (meetingId, id, status) =>
    fetch(`${BASE_URL}/${meetingId}/speak-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),

  // Polls
  getPolls: (meetingId) => fetch(`${BASE_URL}/${meetingId}/polls`).then((r) => r.json()),
  createPoll: (meetingId, payload) =>
    fetch(`${BASE_URL}/${meetingId}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((r) => r.json()),
  updatePollStatus: (meetingId, pollId, status) =>
    fetch(`${BASE_URL}/${meetingId}/polls/${pollId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),
  castVote: (meetingId, pollId, optionId) =>
    fetch(`${BASE_URL}/${meetingId}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId }),
    }).then((r) => r.json()),
  getMyVote: (meetingId, pollId) =>
    fetch(`${BASE_URL}/${meetingId}/polls/${pollId}/my-vote`).then((r) => r.json()),

  // Comments
  getComments: (meetingId) => fetch(`${BASE_URL}/${meetingId}/comments`).then((r) => r.json()),
  addComment: (meetingId, content) =>
    fetch(`${BASE_URL}/${meetingId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }).then((r) => r.json()),
}
