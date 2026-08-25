const BASE = '/api/phonghopkhonggiayto'

export const scheduleApi = {
  getPublic: () => fetch(`${BASE}/schedule/public`).then((r) => r.json()),
  getLeader: () => fetch(`${BASE}/meetings/schedule`).then((r) => r.json()),
  getUnit: () => fetch(`${BASE}/meetings/my-meetings`).then((r) => r.json()),
}
