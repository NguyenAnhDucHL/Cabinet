const BASE = '/api/phonghopkhonggiayto/proceedings'

export const proceedingApi = {
  getAll: () => fetch(BASE).then((r) => r.json()),
  getById: (id) => fetch(`${BASE}/${id}`).then((r) => r.json()),
  create: (body) =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  delete: (id) => fetch(`${BASE}/${id}`, { method: 'DELETE' }).then((r) => r.json()),
  addMeeting: (proceedingId, meetingId) =>
    fetch(`${BASE}/${proceedingId}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetingId }),
    }).then((r) => r.json()),
  removeMeeting: (proceedingId, meetingId) =>
    fetch(`${BASE}/${proceedingId}/meetings/${meetingId}`, {
      method: 'DELETE',
    }).then((r) => r.json()),
}
