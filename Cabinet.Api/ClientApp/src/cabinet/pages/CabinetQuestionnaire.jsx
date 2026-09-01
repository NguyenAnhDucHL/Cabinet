import React, { useState, useEffect } from 'react'
import { CabinetQuestionnaireTemplates } from './CabinetQuestionnaireTemplates'
import { CabinetQuestionnaireCreate } from './CabinetQuestionnaireCreate'
import { QuestionnaireSidebar } from '../../features/questionnaires/components/QuestionnaireList/QuestionnaireSidebar'
import { QuestionnaireHeader } from '../../features/questionnaires/components/QuestionnaireList/QuestionnaireHeader'
import { QuestionnaireTabs } from '../../features/questionnaires/components/QuestionnaireList/QuestionnaireTabs'
import { QuestionnaireTable } from '../../features/questionnaires/components/QuestionnaireList/QuestionnaireTable'
import { QuestionnaireMyList } from '../../features/questionnaires/components/QuestionnaireList/QuestionnaireMyList'

export function CabinetQuestionnaire() {
  const [activeTab, setActiveTab] = useState('pending')
  const [activeSidebar, setActiveSidebar] = useState('list')
  const [mode, setMode] = useState('list') // 'list' | 'create'
  const [questionnaires, setQuestionnaires] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchQuestionnaires = () => {
    setLoading(true)
    setPage(1)
    fetch('/api/phonghopkhonggiayto/questionnaires')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          const data = Array.isArray(json.data) ? json.data : []
          setQuestionnaires(data)
        } else if (Array.isArray(json)) {
          setQuestionnaires(json)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchQuestionnaires()
  }, [])

  const filtered = questionnaires.filter(
    (q) => !search || q.title?.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">
      <QuestionnaireSidebar
        activeSidebar={activeSidebar}
        setActiveSidebar={(val) => {
          setActiveSidebar(val)
          setMode('list')
        }}
        setMode={setMode}
      />

      {mode === 'create' ? (
        <CabinetQuestionnaireCreate
          onBack={() => setMode('list')}
          onSaved={() => {
            setMode('list')
            fetchQuestionnaires()
          }}
        />
      ) : activeSidebar === 'template' ? (
        <CabinetQuestionnaireTemplates />
      ) : activeSidebar === 'my' ? (
        <QuestionnaireMyList />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <QuestionnaireHeader setMode={setMode} />

          <QuestionnaireTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <QuestionnaireTable
            loading={loading}
            paged={paged}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            filteredLength={filtered.length}
            totalPages={totalPages}
            activeTab={activeTab}
            onRefresh={fetchQuestionnaires}
          />
        </div>
      )}
    </div>
  )
}
