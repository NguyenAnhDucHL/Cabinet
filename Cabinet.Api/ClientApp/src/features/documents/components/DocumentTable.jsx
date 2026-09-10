import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Settings2,
  Download,
  Trash2,
  Share2,
  Star,
  FileText,
  File,
  FileSpreadsheet,
  FileImage,
} from 'lucide-react'
import { DocumentUploadModal } from './DocumentUploadModal'
import { documentApi } from '../api/documentApi'

const DEFAULT_COLUMNS = [
  { id: 'name', label: 'Tên tài liệu / Trích yếu', defaultVisible: true },
  { id: 'file', label: 'File tài liệu', defaultVisible: true },
  { id: 'documentType', label: 'Loại tài liệu', defaultVisible: true },
  { id: 'issuingAuthority', label: 'Cơ quan ban hành', defaultVisible: true },
  { id: 'createdAt', label: 'Ngày tạo', defaultVisible: true },
]

const getFileIcon = (ext) => {
  if (!ext) return <File className="w-5 h-5 text-gray-400" />
  switch (ext.toLowerCase()) {
    case '.pdf':
      return <FileText className="w-5 h-5 text-red-500" />
    case '.doc':
    case '.docx':
      return <FileText className="w-5 h-5 text-blue-500" />
    case '.xls':
    case '.xlsx':
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />
    case '.ppt':
    case '.pptx':
      return <FileImage className="w-5 h-5 text-orange-500" />
    default:
      return <File className="w-5 h-5 text-gray-400" />
  }
}

export function DocumentTable({ documents, loading, type, onRefresh }) {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const toggleColumn = (id) => {
    setColumns((cols) =>
      cols.map((c) => (c.id === id ? { ...c, defaultVisible: !c.defaultVisible } : c))
    )
  }

  const visibleColumns = columns.filter((c) => c.defaultVisible)

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return
    try {
      await documentApi.deleteDocument(id)
      onRefresh()
    } catch (e) {
      console.error(e)
    }
  }

  const handleToggleImportant = async (doc) => {
    try {
      if (doc.isImportant) {
        await documentApi.unmarkImportant(doc.id)
      } else {
        await documentApi.markImportant(doc.id)
      }
      onRefresh()
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {(type === 'CaNhan' || type === 'DungChung') && (
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-[var(--color-primary)] hover:bg-red-700 text-white"
            >
              Tải lên tài liệu
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-gray-600">
                <Settings2 className="w-4 h-4 mr-2" />
                Cấu hình hiển thị
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-800">Chọn cột hiển thị</h4>
                <div className="space-y-2">
                  {columns.map((col) => (
                    <div key={col.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col.id}`}
                        checked={col.defaultVisible}
                        onCheckedChange={() => toggleColumn(col.id)}
                      />
                      <label
                        htmlFor={`col-${col.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {col.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableHead key={col.id} className="font-semibold text-gray-700">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-[120px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + 1}
                  className="h-32 text-center text-gray-500"
                >
                  Không có tài liệu nào
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  {visibleColumns.map((col) => {
                    switch (col.id) {
                      case 'name':
                        return (
                          <TableCell key={col.id} className="font-medium text-gray-800">
                            {doc.name}
                          </TableCell>
                        )
                      case 'file':
                        return (
                          <TableCell key={col.id}>
                            <div className="flex items-center gap-2">
                              {getFileIcon(doc.fileType)}
                              <span className="text-sm text-gray-500 uppercase">
                                {doc.fileType?.replace('.', '')}
                              </span>
                            </div>
                          </TableCell>
                        )
                      case 'documentType':
                        return <TableCell key={col.id}>{doc.documentType}</TableCell>
                      case 'issuingAuthority':
                        return <TableCell key={col.id}>{doc.issuingAuthority}</TableCell>
                      case 'createdAt':
                        return (
                          <TableCell key={col.id}>
                            {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                          </TableCell>
                        )
                      default:
                        return <TableCell key={col.id} />
                    }
                  })}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={doc.isImportant ? 'Bỏ đánh dấu quan trọng' : 'Đánh dấu quan trọng'}
                        onClick={() => handleToggleImportant(doc)}
                      >
                        <Star
                          className={`w-4 h-4 ${doc.isImportant ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                        />
                      </Button>
                      <Button variant="ghost" size="icon" title="Tải xuống" asChild>
                        <a
                          href={`/api/files/download?path=${encodeURIComponent(doc.filePath)}`}
                          download
                        >
                          <Download className="w-4 h-4 text-blue-600" />
                        </a>
                      </Button>
                      {(type === 'CaNhan' || type === 'DungChung') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xóa"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={onRefresh}
        type={type}
      />
    </div>
  )
}
