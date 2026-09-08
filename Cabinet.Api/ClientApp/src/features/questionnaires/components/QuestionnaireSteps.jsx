import { useRef } from 'react'
import { UploadCloud, X, Check, Plus } from 'lucide-react'

export function QuestionnaireStep1({ formData, setFormData, templates, files, setFiles }) {
  const fileInputRef = useRef(null)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên phiếu <span className="text-[var(--color-primary)]">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          placeholder="Nhập tên phiếu"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mẫu phiếu <span className="text-[var(--color-primary)]">*</span>
        </label>
        <select
          value={formData.templateId}
          onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
        >
          <option value="">Chọn mẫu phiếu</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hạn trả lời <span className="text-[var(--color-primary)]">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại phiếu ý kiến <span className="text-[var(--color-primary)]">*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          >
            <option value="">Loại phiếu ý kiến</option>
            <option value="Đồng ý / Không đồng ý">Đồng ý / Không đồng ý</option>
            <option value="Trắc nghiệm nhiều lựa chọn">Trắc nghiệm nhiều lựa chọn</option>
            <option value="Ý kiến tự do">Ý kiến tự do</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Tài liệu đính kèm</label>
          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <Plus size={14} /> Tạo thư mục
          </button>
        </div>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--color-primary)]/30 rounded-xl bg-red-50/50 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-red-50 transition-colors"
        >
          <UploadCloud size={32} className="text-[var(--color-primary)] mb-3" />
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-semibold text-[var(--color-primary)]">Chọn file</span> hoặc Kéo
            thả từ máy tính
          </p>
          <p className="text-xs text-gray-500">
            Tối đa 50MB, định dạng .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .msg, .txt, .jpeg,
            .png, .jpg, .mp4
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={(e) => {
              if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files)])
            }}
          />
        </div>
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
              >
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                <button
                  onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function QuestionnaireStep2({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung lấy ý kiến</label>
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] min-h-[300px]"
        placeholder="Nhập nội dung cần lấy ý kiến tại đây..."
      />
    </div>
  )
}

export function QuestionnaireStep3({ users, selectedUsers, toggleUser }) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Chọn thành viên</label>
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm cán bộ..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
        />
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {users.map((u) => (
            <label
              key={u.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(u.id)}
                onChange={() => toggleUser(u.id)}
                className="w-4 h-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{u.fullName || u.username}</p>
                <p className="text-xs text-gray-500">{u.email || u.phoneNumber}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export function QuestionnaireStepper({ step }) {
  const steps = [
    { id: 1, title: 'Chi tiết phiếu' },
    { id: 2, title: 'Nội dung cần lấy ý kiến' },
    { id: 3, title: 'Thành viên tham gia trả lời' },
  ]
  return (
    <div className="px-8 py-6 border-b border-gray-100 shrink-0">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-100 -z-10" />
        {steps.map((s) => {
          const isActive = step === s.id
          const isPassed = step > s.id
          return (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white border-2 border-[var(--color-primary)]'
                    : isPassed
                      ? 'bg-white text-[var(--color-primary)] border-2 border-[var(--color-primary)]'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {isPassed ? <Check size={16} /> : s.id}
              </div>
              <span
                className={`text-xs font-medium ${isActive || isPassed ? 'text-gray-800' : 'text-gray-400'}`}
              >
                {s.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
