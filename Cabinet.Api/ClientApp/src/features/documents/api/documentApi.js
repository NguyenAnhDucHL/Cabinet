export const documentApi = {
  getFolders: (type, parentId = null) => {
    let url = `/api/documents/folders?type=${type}`
    if (parentId) url += `&parentId=${parentId}`
    return fetch(url).then((r) => r.json())
  },
  createFolder: (data) =>
    fetch('/api/documents/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  updateFolder: (id, data) =>
    fetch(`/api/documents/folders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  deleteFolder: (id) =>
    fetch(`/api/documents/folders/${id}`, {
      method: 'DELETE',
    }).then((r) => r.json()),

  getDocuments: (type, folderId = null) => {
    let url = `/api/documents?type=${type}`
    if (folderId) url += `&folderId=${folderId}`
    return fetch(url).then((r) => r.json())
  },
  getDocument: (id) => fetch(`/api/documents/${id}`).then((r) => r.json()),
  uploadDocument: (formData) =>
    fetch('/api/documents/upload', {
      method: 'POST',
      body: formData, // FormData includes file, name, documentType, issuingAuthority, folderId, type
    }).then((r) => r.json()),
  deleteDocument: (id) =>
    fetch(`/api/documents/${id}`, {
      method: 'DELETE',
    }).then((r) => r.json()),

  markImportant: (id) =>
    fetch(`/api/documents/${id}/important`, {
      method: 'POST',
    }).then((r) => r.json()),
  unmarkImportant: (id) =>
    fetch(`/api/documents/${id}/unimportant`, {
      method: 'POST',
    }).then((r) => r.json()),

  shareDocument: (id, userIds) =>
    fetch(`/api/documents/${id}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userIds),
    }).then((r) => r.json()),
  unshareDocument: (id, userId) =>
    fetch(`/api/documents/${id}/share/${userId}`, {
      method: 'DELETE',
    }).then((r) => r.json()),
  getShares: (id) => fetch(`/api/documents/${id}/shares`).then((r) => r.json()),
}
