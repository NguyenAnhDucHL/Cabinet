const BASE = '/api/phonghopkhonggiayto/conclusions'

export const conclusionApi = {
  getAll: (page = 1, pageSize = 10, search = '') => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (search) params.append('search', search)
    return fetch(`${BASE}?${params}`).then((r) => r.json())
  },
  create: (body) =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  update: (id, body) =>
    fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  delete: (id) => fetch(`${BASE}/${id}`, { method: 'DELETE' }).then((r) => r.json()),
  export: (search = '') => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    return fetch(`${BASE}/export?${params}`).then((r) => {
      if (!r.ok) throw new Error('Không thể xuất Excel')
      return r.blob()
    })
  },
}
