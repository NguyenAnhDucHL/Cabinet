import { Edit, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const STATUS_STYLES = {
  'Đã xử lý': 'bg-green-100 text-green-700',
  'Đang xử lý': 'bg-blue-100 text-blue-700',
  'Chưa xử lý': 'bg-orange-100 text-orange-700',
}

export function ConclusionTable({ data, loading, page, pageSize }) {
  const stt = (idx) => (page - 1) * pageSize + idx + 1

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
            <TableHead>Số văn bản</TableHead>
            <TableHead>Ngày ban hành</TableHead>
            <TableHead>Phiên họp</TableHead>
            <TableHead>File kết luận</TableHead>
            <TableHead className="text-center">Tiến độ</TableHead>
            <TableHead>Người xử lý</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <p>Không có dữ liệu</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow key={row.id}>
                <TableCell className="text-center">{stt(idx)}</TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {row.documentNumber || '—'}
                </TableCell>
                <TableCell className="text-gray-600">
                  {row.documentDate ? new Date(row.documentDate).toLocaleDateString('vi-VN') : '—'}
                </TableCell>
                <TableCell className="font-medium text-gray-900">{row.meetingTitle}</TableCell>
                <TableCell className="text-gray-600">{row.fileName || '—'}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-[var(--color-primary)] h-1.5 rounded-full"
                        style={{ width: `${row.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{row.progress || 0}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{row.lastHandlerName || '—'}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
