import React, { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle2, Clock, Send } from 'lucide-react'
import { questionnaireApi } from '../../api/questionnaireApi'

function StatusBadge({ status }) {
  const map = {
    'Chưa trả lời': 'bg-yellow-100 text-yellow-700',
    'Đã trả lời': 'bg-green-100 text-green-700',
    'Hết hạn': 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}
    >
      {status}
    </span>
  )
}

function QuestionnaireCard({ q, onOpen }) {
  const isPast = new Date(q.deadline) < new Date()
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-[#c8102e]/30 transition-all cursor-pointer group"
      onClick={() => onOpen(q.id)}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 group-hover:text-[#c8102e] transition-colors line-clamp-2">
          {q.title}
        </h3>
        <StatusBadge status={q.status} />
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Clock size={12} /> Hạn:{' '}
          <span className={isPast ? 'text-red-500 font-medium' : ''}>
            {new Date(q.deadline).toLocaleDateString('vi-VN')}
          </span>
        </span>
        {q.meetingTitle && <span className="truncate">📅 {q.meetingTitle}</span>}
      </div>
    </div>
  )
}

function QuestionnaireRespondDetail({ id, onBack }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    questionnaireApi
      .getDetail(id)
      .then((res) => {
        if (res.success) {
          setDetail(res.data)
          const init = {}
          ;(res.data.myResponses || []).forEach((r) => {
            init[r.itemId] = r.selectedOptionId
          })
          setAnswers(init)
          setSubmitted(res.data.hasResponded)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async () => {
    const responses = Object.entries(answers).map(([itemId, optId]) => ({
      itemId: parseInt(itemId),
      selectedOptionId: optId,
    }))
    if (responses.length === 0) {
      alert('Vui lòng chọn ít nhất một phương án.')
      return
    }
    setSubmitting(true)
    try {
      const res = await questionnaireApi.respond(id, responses)
      if (res.success) {
        setSubmitted(true)
        alert(res.message || 'Đã gửi câu trả lời thành công.')
      } else alert(res.message || 'Không thể gửi câu trả lời.')
    } catch {
      alert('Lỗi kết nối máy chủ.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Đang tải...</p>
      </div>
    )
  if (!detail)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-400">Không tìm thấy phiếu.</p>
      </div>
    )

  const q = detail.questionnaire
  const items = detail.items || []
  const isPast = new Date(q.deadline) < new Date()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{q.title}</h2>
            {q.meetingTitle && <p className="text-xs text-gray-500">📅 {q.meetingTitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={q.status} />
          <span
            className={`text-xs px-2 py-1 rounded-md ${isPast ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}
          >
            Hạn: {new Date(q.deadline).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {submitted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-600 shrink-0" />
              <p className="text-green-700 text-sm font-medium">
                Bạn đã trả lời phiếu này. Có thể cập nhật câu trả lời nếu chưa hết hạn.
              </p>
            </div>
          )}
          {q.content && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-medium mb-1">Mô tả phiếu:</p>
              <p className="text-sm text-blue-700">{q.content}</p>
            </div>
          )}
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium mb-2">Phiếu chưa có câu hỏi</p>
            </div>
          ) : (
            items.map((item, idx) => {
              const isVote = item.itemType === 'Biểu quyết'
              const displayOptions = isVote
                ? [
                    { id: -1, optionText: 'Đồng ý' },
                    { id: -2, optionText: 'Không đồng ý' },
                  ]
                : item.options
              return (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-7 h-7 bg-[#c8102e] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.content}</p>
                      <span className="text-xs text-gray-400 mt-0.5 block">
                        {isVote ? 'Biểu quyết' : 'Chọn một phương án'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 ml-10">
                    {displayOptions.map((opt) => {
                      const isSelected = answers[item.id] === opt.id
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-[#c8102e] bg-red-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                        >
                          <input
                            type="radio"
                            name={`item-${item.id}`}
                            checked={isSelected}
                            onChange={() => setAnswers((prev) => ({ ...prev, [item.id]: opt.id }))}
                            className="accent-[#c8102e]"
                            disabled={isPast && submitted}
                          />
                          <span
                            className={`text-sm font-medium ${isSelected ? 'text-[#c8102e]' : 'text-gray-700'}`}
                          >
                            {opt.optionText}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
          {items.length > 0 && !isPast && (
            <div className="flex justify-end pt-2 pb-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-[#c8102e] hover:bg-[#a50e27] text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 shadow-sm"
              >
                <Send size={16} />
                {submitting
                  ? 'Đang gửi...'
                  : submitted
                    ? 'Cập nhật câu trả lời'
                    : 'Gửi câu trả lời'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function QuestionnaireMyList() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    questionnaireApi
      .getMyAssigned()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setList(res.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (selectedId)
    return <QuestionnaireRespondDetail id={selectedId} onBack={() => setSelectedId(null)} />

  const filtered = list.filter(
    (q) => !search || q.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white px-6 py-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Phiếu nhận được</h2>
            <p className="text-sm text-gray-500">Danh sách phiếu lấy ý kiến được gửi đến bạn</p>
          </div>
          <span className="bg-[#c8102e]/10 text-[#c8102e] text-sm font-semibold px-3 py-1 rounded-full">
            {list.length} phiếu
          </span>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm phiếu..."
          className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="text-center py-16 text-gray-400 animate-pulse">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-gray-500 font-medium">Chưa có phiếu lấy ý kiến nào</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto grid gap-3">
            {filtered.map((q) => (
              <QuestionnaireCard key={q.id} q={q} onOpen={setSelectedId} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
