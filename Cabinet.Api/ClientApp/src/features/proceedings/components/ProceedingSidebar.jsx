import React, { useState } from 'react'
import { FileText, Folder, Loader2, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

export function ProceedingSidebar({
  proceedings,
  loading,
  selectedId,
  menuOpenId,
  menuRef,
  onSelect,
  onMenuToggle,
  onDelete,
}) {
  const [deletingId, setDeletingId] = useState(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (proceedings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FileText className="h-10 w-10 mb-2" />
        <p className="text-sm">Chưa có kỷ yếu nào</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {proceedings.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item)}
          className={`flex items-center justify-between p-3 rounded-md cursor-pointer mb-1 ${
            selectedId === item.id ? 'bg-red-50 border border-red-100' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Folder
              className={`h-5 w-5 flex-shrink-0 ${selectedId === item.id ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}
            />
            <span
              className={`text-sm truncate ${selectedId === item.id ? 'font-semibold text-[var(--color-primary)]' : 'text-gray-700'}`}
            >
              {item.name}
            </span>
          </div>
          <div className="relative" ref={menuOpenId === item.id ? menuRef : null}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                onMenuToggle(menuOpenId === item.id ? null : item.id)
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {menuOpenId === item.id && (
              <div
                className="absolute right-0 top-9 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                  onClick={() => setDeletingId(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa kỷ yếu
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <ConfirmationModal
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Xóa kỷ yếu"
        description="Bạn có chắc chắn muốn xóa kỷ yếu này không? Hành động này không thể hoàn tác."
        onConfirm={() => {
          onDelete(deletingId)
          setDeletingId(null)
        }}
      />
    </div>
  )
}
