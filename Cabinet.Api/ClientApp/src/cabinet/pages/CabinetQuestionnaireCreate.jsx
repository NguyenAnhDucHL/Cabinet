import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useQuestionnaireCreate } from '../../features/questionnaires/hooks/useQuestionnaireCreate'
import { questionnaireApi } from '../../features/questionnaires/api/questionnaireApi'
import {
  QuestionnaireStepper,
  QuestionnaireStep1,
  QuestionnaireStep2,
  QuestionnaireStep3,
} from '../../features/questionnaires/components/QuestionnaireSteps'

export function CabinetQuestionnaireCreate({ onBack, onSaved }) {
  const { templates, users } = useQuestionnaireCreate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    templateId: '',
    deadline: '',
    type: '',
    content: '',
  })
  const [selectedUsers, setSelectedUsers] = useState([])
  const [files, setFiles] = useState([])

  const toggleUser = (userId) =>
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )

  const handleSubmit = async () => {
    if (!formData.title || !formData.deadline) {
      window.alert('Vui lòng nhập tên phiếu và hạn trả lời')
      return
    }
    setLoading(true)
    const fd = new FormData()
    fd.append('title', formData.title)
    if (formData.templateId) fd.append('templateId', formData.templateId)
    if (formData.type) fd.append('type', formData.type)
    if (formData.content) fd.append('content', formData.content)
    if (formData.deadline) fd.append('deadline', formData.deadline)
    fd.append('assignedUserIdsStr', JSON.stringify(selectedUsers))
    files.forEach((file) => fd.append('files', file))

    try {
      const json = await questionnaireApi.create(fd)
      if (json.success) onSaved()
      else window.alert(json.message || 'Có lỗi xảy ra')
    } catch (_e) {
      window.alert('Có lỗi xảy ra khi lưu phiếu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center shrink-0">
        <button
          onClick={onBack}
          className="mr-3 p-1 hover:bg-gray-100 rounded-full transition text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Thêm mới phiếu lấy ý kiến</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-4xl mx-auto overflow-hidden flex flex-col">
          <QuestionnaireStepper step={step} />

          {/* Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {step === 1 && (
              <QuestionnaireStep1
                formData={formData}
                setFormData={setFormData}
                templates={templates}
                files={files}
                setFiles={setFiles}
              />
            )}
            {step === 2 && <QuestionnaireStep2 formData={formData} setFormData={setFormData} />}
            {step === 3 && (
              <QuestionnaireStep3
                users={users}
                selectedUsers={selectedUsers}
                toggleUser={toggleUser}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between shrink-0">
            <button
              onClick={onBack}
              className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="px-6 py-2 text-sm font-medium text-[var(--color-primary)] bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Quay lại
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="px-6 py-2 text-sm font-medium text-[var(--color-primary)] bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-transparent"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-[#a50e27] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : 'Lưu nháp'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
