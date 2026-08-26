const BASE = '/api/phonghopkhonggiayto/questionnaires'
const TPL_BASE = '/api/phonghopkhonggiayto/questionnaire-templates'

export const questionnaireApi = {
  getAll: () => fetch(BASE).then((r) => r.json()),
  getById: (id) => fetch(`${BASE}/${id}`).then((r) => r.json()),
  create: (body) =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  respond: (id, answers) =>
    fetch(`${BASE}/${id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
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
  deleteTemplate: (id) => fetch(`${TPL_BASE}/${id}`, { method: 'DELETE' }).then((r) => r.json()),
}
