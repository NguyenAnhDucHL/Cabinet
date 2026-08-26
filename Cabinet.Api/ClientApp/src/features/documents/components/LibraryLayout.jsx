import React, { useState } from 'react'
import { useDocuments } from '../hooks/useDocuments'
import { FolderTree } from './FolderTree'
import { DocumentTable } from './DocumentTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { documentApi } from '../api/documentApi'
// Mock modal for folder creation, in a real app this would be a separate component
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export function LibraryLayout({ type, label }) {
  const {
    folders,
    documents,
    loading,
    selectedFolderId,
    setSelectedFolderId,
    refreshFolders,
    refreshDocuments,
  } = useDocuments(type)
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const hasFolderSidebar = type === 'DungChung' || type === 'CaNhan' || type === 'DuocChiaSe'
  const canCreateFolder = type === 'CaNhan' // DungChung usually restricted, assuming Cá nhân for now

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    try {
      await documentApi.createFolder({
        name: newFolderName,
        type: type,
        parentId: selectedFolderId,
      })
      setIsFolderModalOpen(false)
      setNewFolderName('')
      refreshFolders()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex h-full w-full">
      {/* Left Sidebar: Folder Tree */}
      {hasFolderSidebar && (
        <div className="w-[300px] border-r border-gray-100 bg-white flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Danh sách thư mục</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <FolderTree
              folders={folders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
            />
          </div>
        </div>
      )}

      {/* Right Content: Document Table */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">{label}</h2>
          {canCreateFolder && (
            <Button
              onClick={() => setIsFolderModalOpen(true)}
              className="bg-[#c8102e] hover:bg-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới thư mục
            </Button>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <DocumentTable
            documents={documents}
            loading={loading}
            type={type}
            onRefresh={refreshDocuments}
          />
        </div>
      </div>

      <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm mới thư mục</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Tên thư mục..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFolderModalOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-[#c8102e] hover:bg-red-700 text-white"
              onClick={handleCreateFolder}
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
