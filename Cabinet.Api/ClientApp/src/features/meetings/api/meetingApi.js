const BASE = '/api/phonghopkhonggiayto/meetings'

export const meetingApi = {
  getAll: () => fetch(`${BASE}/schedule`).then((r) => r.json()),
  getMyMeetings: () => fetch(`${BASE}/my-meetings`).then((r) => r.json()),
  getById: (id) => fetch(`${BASE}/${id}`).then((r) => r.json()),
  getDashboard: () => fetch(`${BASE}/dashboard`).then((r) => r.json()),
  create: (formData) => fetch(BASE, { method: 'POST', body: formData }).then((r) => r.json()),
  update: (id, formData) =>
    fetch(`${BASE}/${id}`, { method: 'PUT', body: formData }).then((r) => r.json()),
  delete: (id) => fetch(`${BASE}/${id}`, { method: 'DELETE' }).then((r) => r.json()),
  cancel: (id) => fetch(`${BASE}/${id}/cancel`, { method: 'POST' }).then((r) => r.json()),
  updateAttendance: (meetingId, userId, status) =>
    fetch(`${BASE}/${meetingId}/attendance/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),
  getParticipants: (meetingId) => fetch(`${BASE}/${meetingId}/participants`).then((r) => r.json()),
  sendInvitation: (meetingId) =>
    fetch(`${BASE}/${meetingId}/send-invitation`, { method: 'POST' }).then((r) => r.json()),
  reportAbsence: (meetingId, reason, substituteUserId) =>
    fetch(`${BASE}/${meetingId}/report-absence`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, substituteUserId }),
    }).then((r) => r.json()),
  approveAbsence: (meetingId, targetUserId, approve) =>
    fetch(`${BASE}/${meetingId}/approve-absence/${targetUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approve }),
    }).then((r) => r.json()),
}
