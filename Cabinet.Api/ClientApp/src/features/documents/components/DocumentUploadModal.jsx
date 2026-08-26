import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { documentApi } from '../api/documentApi'

export function DocumentUploadModal({ isOpen, onClose, onSuccess, type, folderId = null }) {
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [issuingAuthority, setIssuingAuthority] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
      const allowedExts = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf']

      if (!allowedExts.includes(ext)) {
        alert('Định dạng file không hỗ trợ. (Chỉ cho phép: doc, docx, xls, xlsx, ppt, pptx, pdf)')
        e.target.value = null
        return
      }

      setFile(selectedFile)
      if (!name) {
        setName(selectedFile.name)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Vui lòng chọn file')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', name)
      formData.append('documentType', documentType)
      formData.append('issuingAuthority', issuingAuthority)
      formData.append('type', type)
      if (folderId) {
        formData.append('folderId', folderId)
      }

      const res = await documentApi.uploadDocument(formData)
      if (res.success) {
        onSuccess()
        handleClose()
      } else {
        alert(res.message || 'Lỗi khi tải lên')
      }
    } catch (e) {
      console.error(e)
      alert('Có lỗi xảy ra')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setName('')
    setDocumentType('')
    setIssuingAuthority('')
    if (fileInputRef.current) fileInputRef.current.value = null
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tải lên tài liệu</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tên tài liệu / Trích yếu</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên hoặc để trống sẽ lấy theo tên file"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Loại tài liệu (Số ký hiệu)</label>
            <Input
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              placeholder="VD: 123/QĐ-UBND"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Cơ quan ban hành</label>
            <Input
              value={issuingAuthority}
              onChange={(e) => setIssuingAuthority(e.target.value)}
              placeholder="Nhập cơ quan ban hành"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">File đính kèm</label>
            {!file ? (
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click để chọn file</p>
                <p className="text-xs text-gray-400 mt-1">
                  Hỗ trợ .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 bg-white rounded shadow-sm shrink-0">
                    <UploadCloud className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                  className="shrink-0"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Hủy
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className="bg-[#c8102e] hover:bg-red-700 text-white"
          >
            {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Tải lên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
