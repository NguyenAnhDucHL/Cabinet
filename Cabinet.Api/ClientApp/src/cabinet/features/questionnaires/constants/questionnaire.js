import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react'

export const TABS = [
  { id: 'pending', label: 'Phiếu chưa trả lời' },
  { id: 'answered', label: 'Phiếu đã trả lời' },
  { id: 'expired', label: 'Phiếu đã hết hạn' },
  { id: 'created', label: 'Phiếu đã tạo' },
]

export const STATUS_BADGE = {
  pending: {
    label: 'Chờ trả lời',
    class: 'bg-amber-100 text-amber-700 border border-amber-200',
    icon: Clock,
  },
  answered: {
    label: 'Đã trả lời',
    class: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    icon: CheckCircle2,
  },
  expired: {
    label: 'Hết hạn',
    class: 'bg-red-100 text-red-700 border border-red-200',
    icon: XCircle,
  },
  created: {
    label: 'Đã tạo',
    class: 'bg-blue-100 text-blue-700 border border-blue-200',
    icon: FileText,
  },
}
