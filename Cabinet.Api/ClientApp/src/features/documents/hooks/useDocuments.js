import { useState, useEffect, useCallback } from 'react'
import { documentApi } from '../api/documentApi'

export function useDocuments(type) {
  const [folders, setFolders] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFolderId, setSelectedFolderId] = useState(null)

  const fetchFolders = useCallback(async () => {
    if (type === 'QuanTrong' || type === 'DuocChiaSe') {
      setFolders([])
      return
    }
    try {
      const res = await documentApi.getFolders(type)
      if (res.success) setFolders(res.data || [])
    } catch (e) {
      console.error('Failed to fetch folders', e)
    }
  }, [type])

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      const res = await documentApi.getDocuments(type, selectedFolderId)
      if (res.success) setDocuments(res.data || [])
    } catch (e) {
      console.error('Failed to fetch documents', e)
    } finally {
      setLoading(false)
    }
  }, [type, selectedFolderId])

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return {
    folders,
    documents,
    loading,
    selectedFolderId,
    setSelectedFolderId,
    refreshFolders: fetchFolders,
    refreshDocuments: fetchDocuments,
  }
}
