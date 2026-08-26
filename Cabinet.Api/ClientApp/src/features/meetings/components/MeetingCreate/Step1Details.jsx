import React from 'react'
import { Plus, UploadCloud, X, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function Step1Details({
  formData,
  setFormData,
  proceedings,
  rooms,
  programFiles,
  setProgramFiles,
  programInputRef,
  invitationFiles,
  setInvitationFiles,
  invitationInputRef,
}) {
  const handleFileChange = (e, setFiles) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }
  const removeFile = (idx, setFiles) => setFiles((prev) => prev.filter((_, i) => i !== idx))

  const renderFileUploader = (label, files, setFiles, inputRef) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name={`type_${label}`} defaultChecked className="text-blue-600" />{' '}
            Tải tài liệu
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name={`type_${label}`} className="text-blue-600" /> Nhập văn bản
          </label>
        </div>
      </div>
      <div
        className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-500 mb-2">
          <UploadCloud size={20} />
        </div>
        <p className="text-sm text-gray-500 mb-1">Click hoặc kéo thả file vào đây để tải lên</p>
        <p className="text-xs text-gray-400">PDF, DOC, DOCX (Max 20MB)</p>
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          multiple
          onChange={(e) => handleFileChange(e, setFiles)}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white border border-gray-200 px-3 py-2 rounded-md"
            >
              <span className="text-sm text-gray-700 truncate max-w-[80%]">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(idx, setFiles)
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Kỷ yếu phiên họp</label>
          <Select
            value={formData.proceedingId}
            onValueChange={(v) => setFormData({ ...formData, proceedingId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn kỷ yếu" />
            </SelectTrigger>
            <SelectContent>
              {proceedings.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
            <Plus size={16} className="mr-1" /> Thêm vào kỷ yếu
          </Button>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-gray-700">
            Tên phiên họp <span className="text-red-500">*</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.singleContent}
              onChange={(e) => setFormData({ ...formData, singleContent: e.target.checked })}
              className="rounded border-gray-300 text-blue-600"
            />{' '}
            Phiên họp có một nội dung
          </label>
        </div>
        <Textarea
          placeholder="Nhập tên phiên họp"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Thời gian bắt đầu <span className="text-red-500">*</span>
          </label>
          <Input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Thời gian kết thúc <span className="text-red-500">*</span>
          </label>
          <Input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Địa điểm <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.roomId}
            onValueChange={(v) => setFormData({ ...formData, roomId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn phòng họp" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((r) => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="link" className="text-blue-600">
            Sơ đồ vị trí ngồi
          </Button>
        </div>
      </div>
      {renderFileUploader(
        'Nội dung chương trình họp',
        programFiles,
        setProgramFiles,
        programInputRef
      )}
      {renderFileUploader('Giấy mời', invitationFiles, setInvitationFiles, invitationInputRef)}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer border-b border-gray-200">
          <span className="font-semibold text-gray-700">Rút gọn thông tin</span>
          <ArrowLeft size={16} className="-rotate-90 text-gray-500" />
        </div>
        <div className="p-4 space-y-4 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Loại phiên họp
              </label>
              <Select
                value={formData.meetingType}
                onValueChange={(v) => setFormData({ ...formData, meetingType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại phiên họp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Thường kỳ">Thường kỳ</SelectItem>
                  <SelectItem value="Chuyên đề">Chuyên đề</SelectItem>
                  <SelectItem value="Bất thường">Bất thường</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Link họp trực tuyến
              </label>
              <Input
                placeholder="Nhập link"
                value={formData.onlineMeetingUrl}
                onChange={(e) => setFormData({ ...formData, onlineMeetingUrl: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
