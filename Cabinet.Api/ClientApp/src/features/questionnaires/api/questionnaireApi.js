const BASE = '/api/phonghopkhonggiayto/questionnaires'
const TPL_BASE = '/api/phonghopkhonggiayto/questionnaire-templates'

export const questionnaireApi = {
  getAll: () => fetch(BASE).then((r) => r.json()),
  getById: (id) => fetch(`${BASE}/${id}`).then((r) => r.json()),
  getMyAssigned: () => fetch(`${BASE}/my`).then((r) => r.json()),
  getDetail: (id) => fetch(`${BASE}/${id}/detail`).then((r) => r.json()),
  create: (formData) => fetch(BASE, { method: 'POST', body: formData }).then((r) => r.json()),
  send: (id) => fetch(`${BASE}/${id}/send`, { method: 'POST' }).then((r) => r.json()),
  respond: (id, responses) =>
    fetch(`${BASE}/${id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses }),
    }).then((r) => r.json()),
  delete: (id) => fetch(`${BASE}/${id}`, { method: 'DELETE' }).then((r) => r.json()),
  // Templates
  getAllTemplates: () => fetch(TPL_BASE).then((r) => r.json()),
  createTemplate: (body) =>
    fetch(TPL_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  updateTemplate: (id, name) =>
    fetch(`${TPL_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }).then((r) => r.json()),
  deleteTemplate: (id) => fetch(`${TPL_BASE}/${id}`, { method: 'DELETE' }).then((r) => r.json()),
}
