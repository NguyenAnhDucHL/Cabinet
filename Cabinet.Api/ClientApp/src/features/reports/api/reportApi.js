const BASE = '/api/phonghopkhonggiayto/reports'

export const reportApi = {
  getOverview: () => fetch(`${BASE}/overview`).then((r) => r.json()),
  exportMeetings: (startDate, endDate) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    return fetch(`${BASE}/export-meetings?${params.toString()}`).then((r) => r.json())
  },
}
