import React from 'react'
import { Folder } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FolderTree({ folders, selectedFolderId, onSelectFolder }) {
  if (!folders || folders.length === 0) {
    return <div className="text-gray-400 text-sm italic">Chưa có thư mục nào</div>
  }

  // Very basic rendering of flat folders for now.
  // In a real app, we would recursively render nested folders using ParentId
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelectFolder(null)}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
          selectedFolderId === null
            ? 'bg-red-50 text-[var(--color-primary)] font-medium'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <Folder
          className={cn('w-4 h-4', selectedFolderId === null ? 'fill-red-100' : 'text-gray-400')}
        />
        <span>Tất cả tài liệu</span>
      </button>

      {folders.map((folder) => (
        <button
          key={folder.id}
          onClick={() => onSelectFolder(folder.id)}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
            selectedFolderId === folder.id
              ? 'bg-red-50 text-[var(--color-primary)] font-medium'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <Folder
            className={cn(
              'w-4 h-4',
              selectedFolderId === folder.id ? 'fill-red-100' : 'text-gray-400'
            )}
          />
          <span className="truncate">{folder.name}</span>
        </button>
      ))}
    </div>
  )
}
