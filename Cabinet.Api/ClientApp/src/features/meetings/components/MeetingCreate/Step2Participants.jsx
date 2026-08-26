import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Step2Participants({
  users,
  participantTab,
  setParticipantTab,
  groupType,
  setGroupType,
  participantSearch,
  setParticipantSearch,
  presidingUsers,
  setPresidingUsers,
}) {
  const participantTabs = [
    { id: 'DonVi', label: 'Đơn vị' },
    { id: 'CaNhan', label: 'Cá nhân' },
    { id: 'NhomThanhVien', label: 'Nhóm thành viên' },
    { id: 'KhachMoi', label: 'Khách mời' },
  ]
  const mockGroups = [
    'Ban Giám đốc',
    'Ban Thường vụ Đảng ủy các cơ quan Đảng tỉnh Quảng Ninh',
    'Ban Thường vụ Đảng ủy phường Cẩm Phả, Tỉnh Quảng Ninh',
    'Ban Thường vụ Đảng ủy UBND tỉnh Quảng Ninh',
    'Ban Thường vụ Tỉnh ủy',
    'BCĐ phát triển khoa học, công nghệ, đổi mới và sáng tạo phường Cẩm Phả',
  ]
  const filteredUsers = users.filter(
    (u) =>
      (u.fullName || '').toLowerCase().includes(participantSearch.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(participantSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        {participantTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setParticipantTab(tab.id)}
            className={`flex-1 pb-3 text-center font-semibold text-sm transition-colors border-b-2 ${participantTab === tab.id ? 'border-[#c8102e] text-[#c8102e]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {participantTab === 'NhomThanhVien' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Loại nhóm</label>
              <Select value={groupType} onValueChange={setGroupType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại nhóm" />
                </SelectTrigger>
                <SelectContent>
                  {mockGroups.map((g, idx) => (
                    <SelectItem key={idx} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tìm thành viên
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  className="pl-9"
                  placeholder="Tìm kiếm thành viên"
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Danh sách thành viên trong nhóm
            </h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-center">STT</th>
                    <th className="px-4 py-3">Tên thành viên</th>
                    <th className="px-4 py-3">Tên đăng nhập</th>
                    <th className="px-4 py-3">Vai trò</th>
                    <th className="px-4 py-3 text-center">Chủ trì</th>
                    <th className="px-4 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredUsers.map((row, index) => {
                    const isPresiding = presidingUsers.includes(row.id)
                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-gray-50 transition-colors ${isPresiding ? 'bg-red-50 hover:bg-red-50' : ''}`}
                      >
                        <td className="px-4 py-3 text-center text-gray-500">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{row.fullName}</td>
                        <td className="px-4 py-3 text-gray-600">{row.username}</td>
                        <td className="px-4 py-3 text-gray-500">{row.role}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isPresiding}
                            onChange={(e) => {
                              if (e.target.checked) setPresidingUsers((prev) => [...prev, row.id])
                              else setPresidingUsers((prev) => prev.filter((id) => id !== row.id))
                            }}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer w-4 h-4"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {participantTab !== 'NhomThanhVien' && (
        <div className="text-center text-gray-500 py-10">Chưa hỗ trợ ({participantTab})</div>
      )}
    </div>
  )
}
