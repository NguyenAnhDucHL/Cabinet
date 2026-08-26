import {
  Calendar,
  Home,
  Users,
  MapPin,
  ClipboardList,
  BookOpen,
  ShieldCheck,
  MessageSquare,
  UserCheck,
  Building2,
  Settings,
  FileText,
  List,
  Search,
} from 'lucide-react'

export const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Trang chủ' },
  { id: 'schedule', icon: Calendar, label: 'Lịch họp' },
  { id: 'manage_meetings', icon: MessageSquare, label: 'Quản lý họp' },
  { id: 'rooms', icon: MapPin, label: 'Phòng họp' },
  { id: 'questionnaire', icon: ClipboardList, label: 'Phiếu lấy ý kiến' },
  { id: 'library', icon: BookOpen, label: 'Thư viện văn bản' },
  { id: 'admin', icon: ShieldCheck, label: 'Phân quyền' },
]

export const SCHEDULE_SIDEBAR = [
  { icon: Calendar, label: 'Lịch họp cá nhân', type: 'personal' },
  { icon: UserCheck, label: 'Lịch họp lãnh đạo', type: 'leader' },
  { icon: Building2, label: 'Lịch họp đơn vị', type: 'unit' },
]

export const ROOMS_SIDEBAR = [
  { icon: Building2, label: 'Quản lý phòng họp' },
  { icon: Settings, label: 'Cấu hình thành phần' },
  { icon: FileText, label: 'Cấu hình màu sắc' },
  { icon: Users, label: 'Quản lý yêu cầu đặt phòng' },
]

export const MEETINGS_SIDEBAR = [
  { icon: List, label: 'Danh sách phiên họp' },
  { icon: FileText, label: 'Kỷ yếu phiên họp' },
  { icon: Search, label: 'Tra cứu kết luận phiên họp' },
  { icon: BookOpen, label: 'Quản lý sổ tay' },
]

export const LIBRARY_SIDEBAR = [
  { label: 'Thư viện dùng chung', type: 'DungChung', icon: BookOpen },
  { label: 'Thư viện cá nhân', type: 'CaNhan', icon: FileText },
  { label: 'Tài liệu được chia sẻ', type: 'DuocChiaSe', icon: Users },
  { label: 'Tài liệu quan trọng', type: 'QuanTrong', icon: ShieldCheck },
]
