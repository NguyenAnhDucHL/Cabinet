import { useState, useEffect } from 'react'

const BASE_TEMPLATES = '/api/phonghopkhonggiayto/questionnaire-templates'
const BASE_USERS = '/api/users'

export function useQuestionnaireCreate() {
  const [templates, setTemplates] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch(BASE_TEMPLATES)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setTemplates(json.data)
        else if (Array.isArray(json)) setTemplates(json)
        else setTemplates(json.data || [])
      })
      .catch(() => {})

    fetch(BASE_USERS)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setUsers(json.data || [])
        else if (Array.isArray(json)) setUsers(json)
        else setUsers(json.data || [])
      })
      .catch(() => {})
  }, [])

  const create = async (formData, selectedUsers, files) => {
    const fd = new FormData()
    fd.append('title', formData.title)
    fd.append('templateId', formData.templateId)
    fd.append('deadline', formData.deadline)
    fd.append('type', formData.type)
    fd.append('content', formData.content)
    selectedUsers.forEach((u) => fd.append('assignedUserIds', u.id))
    files.forEach((f) => fd.append('files', f))

    const res = await fetch('/api/phonghopkhonggiayto/questionnaire', {
      method: 'POST',
      body: fd,
    })
    return res.json()
  }

  return { templates, users, create }
}
