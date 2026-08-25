const BASE = '/api/phonghopkhonggiayto/notes'

export const noteApi = {
  getByUser: (search = '') => {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    return fetch(`${BASE}${params}`).then((r) => r.json())
  },
  create: (formData) => fetch(BASE, { method: 'POST', body: formData }).then((r) => r.json()),
  delete: (id) => fetch(`${BASE}/${id}`, { method: 'DELETE' }).then((r) => r.json()),
}
