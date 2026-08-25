const BASE = '/api/phonghopkhonggiayto/rooms'

export const roomApi = {
  getAll: () => fetch(BASE).then((r) => r.json()),
  getById: (id) => fetch(`${BASE}/${id}`).then((r) => r.json()),
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
  toggleStatus: (id, status) =>
    fetch(`${BASE}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),
}
