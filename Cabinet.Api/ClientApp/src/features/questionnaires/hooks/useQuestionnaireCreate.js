import { useState, useEffect } from 'react'
import { questionnaireApi } from '../api/questionnaireApi'

const BASE_USERS = '/api/users'

export function useQuestionnaireCreate() {
  const [templates, setTemplates] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    questionnaireApi
      .getAllTemplates()
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

  return { templates, users }
}
