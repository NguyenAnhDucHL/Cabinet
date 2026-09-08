import React, { useState } from 'react'
import { FileText, Loader2, Trash2 } from 'lucide-react'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const fmt = (dt) => {
  if (!dt) return ''
  const d = new Date(dt)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

export function NoteTable({ notes, loading, onDelete }) {
  const [deletingId, setDeletingId] = useState(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-gray-500 h-64">
        <Loader2 className="h-5 w-5 animate-spin" />
        Đang tải dữ liệu...
      </div>
    )
  }

  return (
    <div className="border rounded-md flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">STT</TableHead>
            <TableHead>Tên phiên họp</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead className="text-center">Đính kèm</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <p>Không có dữ liệu</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            notes.map((row, idx) => {
              let attachments = []
              try {
                attachments = JSON.parse(row.attachmentPaths || '[]')
              } catch (_e) {
                attachments = []
              }
              return (
                <TableRow key={row.id}>
                  <TableCell className="text-center">{idx + 1}</TableCell>
                  <TableCell className="font-medium text-gray-900">{row.meetingTitle}</TableCell>
                  <TableCell
                    className="text-gray-600 max-w-[200px] truncate"
                    title={row.content || ''}
                  >
                    {row.content || '—'}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{fmt(row.createdAt)}</TableCell>
                  <TableCell className="text-center">
                    {attachments.length > 0 ? (
                      <span className="text-xs text-[var(--color-primary)] font-medium">
                        {attachments.length} file
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600"
                      onClick={() => setDeletingId(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
      <ConfirmationModal
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Xóa ghi chú"
        description="Bạn có chắc chắn muốn xóa ghi chú này không? Hành động này không thể hoàn tác."
        onConfirm={() => {
          onDelete(deletingId)
          setDeletingId(null)
        }}
      />
    </div>
  )
}
