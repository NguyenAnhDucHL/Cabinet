import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Folder, FolderPlus, FileText, Search, ChevronRight, Check } from 'lucide-react'

export function SaveToLibraryModal({ open, onOpenChange, meeting, onSaved }) {
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchFolder, setSearchFolder] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState(null)

  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  // Documents
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    if (open && meeting) {
      fetchFolders()

      // Parse meeting files
      let docs = []
      try {
        const progFiles = meeting.programFilePaths ? JSON.parse(meeting.programFilePaths) : []
        docs = docs.concat(progFiles)
      } catch {
        // ignore parse error
      }
      try {
        const invFiles = meeting.invitationFilePaths ? JSON.parse(meeting.invitationFilePaths) : []
        docs = docs.concat(invFiles)
      } catch {
        // ignore parse error
      }

      // Distinct and format
      const uniqueDocs = [...new Set(docs)].map((path) => {
        // Extract filename from path
        const parts = path.split('/')
        let name = parts[parts.length - 1]
        // Remove uuid prefix if any
        const match = name.match(/^[a-f0-9]{32}_(.*)/i)
        if (match) {
          name = match[1]
        }
        return { name, path }
      })

      setDocuments(uniqueDocs)
    }
  }, [open, meeting])

  const fetchFolders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/phonghopkhonggiayto/documents/folders?type=CaNhan')
      const json = await res.json()
      if (json.success) {
        setFolders(json.data || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return
    try {
      const res = await fetch('/api/phonghopkhonggiayto/documents/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName, type: 'CaNhan' }),
      })
      const json = await res.json()
      if (json.success) {
        setFolders([...folders, json.data])
        setSelectedFolderId(json.data.id)
        setIsAddingFolder(false)
        setNewFolderName('')
      }
    } catch (e) {
      alert('Không thể tạo thư mục')
    }
  }

  const handleSave = async () => {
    if (!selectedFolderId) {
      alert('Vui lòng chọn thư mục để lưu')
      return
    }
    if (documents.length === 0) {
      alert('Không có tài liệu nào để lưu')
      return
    }

    try {
      const res = await fetch('/api/phonghopkhonggiayto/documents/save-from-existing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderId: selectedFolderId,
          type: 'CaNhan',
          files: documents.map((d) => ({ name: d.name, filePath: d.path })),
        }),
      })
      const json = await res.json()
      if (json.success) {
        if (onSaved) onSaved()
        onOpenChange(false)
      } else {
        alert(json.message || 'Có lỗi xảy ra')
      }
    } catch (e) {
      alert('Không thể kết nối đến máy chủ')
    }
  }

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchFolder.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white p-0 overflow-hidden border-0 rounded-xl shadow-2xl h-[80vh] flex flex-col">
        <DialogHeader className="bg-[var(--color-primary)] px-6 py-4 shrink-0">
          <DialogTitle className="text-white text-lg font-bold">Lưu tài liệu phiên họp</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* Left Panel: Folders */}
          <div className="w-full md:w-1/3 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Folder className="w-4 h-4 mr-2 text-[var(--color-primary)]" />
                Danh sách thư mục
              </h3>
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white"
                  placeholder="Tìm kiếm thư mục..."
                  value={searchFolder}
                  onChange={(e) => setSearchFolder(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="w-full text-[var(--color-primary)] border-[var(--color-primary)] hover:bg-red-50"
                onClick={() => setIsAddingFolder(true)}
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Thêm mới thư mục
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {loading ? (
                <div className="p-4 text-center text-sm text-gray-500">Đang tải...</div>
              ) : filteredFolders.length === 0 ? (
                <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                  <Folder className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">Không có dữ liệu</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredFolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolderId(folder.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${
                        selectedFolderId === folder.id
                          ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <Folder className="w-4 h-4 mr-3 opacity-70" />
                        <span className="truncate text-left">{folder.name}</span>
                      </div>
                      {selectedFolderId === folder.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Documents */}
          <div className="w-full md:w-2/3 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Danh sách tài liệu - {meeting?.title}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {documents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <FileText className="w-16 h-16 mb-4 opacity-20" />
                  <p>Phiên họp này chưa có tài liệu nào.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-100 text-[var(--color-primary)] flex items-center justify-center mr-4 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500 truncate">{doc.path}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button
            className="bg-[var(--color-primary)] hover:bg-[#a50e27] text-white"
            onClick={handleSave}
            disabled={!selectedFolderId || documents.length === 0}
          >
            Lưu
          </Button>
        </div>
      </DialogContent>

      {/* Add Folder Modal (Overlay) */}
      <Dialog open={isAddingFolder} onOpenChange={setIsAddingFolder}>
        <DialogContent className="max-w-sm z-[60]">
          <DialogHeader>
            <DialogTitle>Thêm mới thư mục</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên thư mục <span className="text-red-500">*</span>
            </label>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nhập tên thư mục"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingFolder(false)}>
              Hủy bỏ
            </Button>
            <Button
              className="bg-[var(--color-primary)] hover:bg-[#a50e27] text-white"
              onClick={handleAddFolder}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
