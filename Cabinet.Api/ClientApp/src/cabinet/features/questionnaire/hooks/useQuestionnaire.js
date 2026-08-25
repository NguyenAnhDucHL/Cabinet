import { useState, useEffect, useCallback } from 'react'
import { questionnaireApi } from '../api/questionnaireApi'

export function useQuestionnaire() {
  const [questionnaires, setQuestionnaires] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchQuestionnaires = useCallback(async () => {
    setLoading(true)
    try {
      const json = await questionnaireApi.getAll()
      const data = Array.isArray(json) ? json : json.data || []
      setQuestionnaires(data)
    } catch {
      setQuestionnaires([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTemplates = useCallback(async () => {
    try {
      const json = await questionnaireApi.getAllTemplates()
      const data = Array.isArray(json) ? json : json.data || []
      setTemplates(data)
    } catch {
      setTemplates([])
    }
  }, [])

  useEffect(() => {
    fetchQuestionnaires()
    fetchTemplates()
  }, [])

  return { questionnaires, templates, loading, fetchQuestionnaires, fetchTemplates }
}
