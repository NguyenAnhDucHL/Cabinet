import { useState, useCallback } from 'react'

const BASE = '/api/phonghopkhonggiayto/questionnaire-templates'

export function useQuestionnaireTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTemplates = useCallback(() => {
    setLoading(true)
    fetch(BASE)
      .then((r) => r.json())
      .then((json) => {
        const data = Array.isArray(json) ? json : json.data || []
        setTemplates(data)
      })
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false))
  }, [])

  const create = useCallback(
    async (name) => {
      const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const json = await res.json()
      await fetchTemplates()
      return json
    },
    [fetchTemplates]
  )

  const update = useCallback(
    async (id, name) => {
      const res = await fetch(`${BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const json = await res.json()
      await fetchTemplates()
      return json
    },
    [fetchTemplates]
  )

  const remove = useCallback(async (id) => {
    await fetch(`${BASE}/${id}`, { method: 'DELETE' })
    setTemplates((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { templates, loading, fetchTemplates, create, update, remove }
}
