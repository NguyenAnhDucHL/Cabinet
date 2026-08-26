import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function Step2Participants({
  users,
  usersInSelectedDept,
  departments,
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

  const filteredUsers = (usersInSelectedDept || users).filter(
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phòng ban</label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/25 focus:border-[#c8102e] transition bg-white"
              >
                <option value="">-- Tất cả thành viên --</option>
                {departments.map((d) => (
                  <option key={d.id} value={String(d.id)}>
                    {d.name}
                  </option>
                ))}
              </select>
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
              Danh sách thành viên
              {groupType && departments.length > 0
                ? ` — ${departments.find((d) => String(d.id) === groupType)?.name || ''}`
                : ' — Tất cả'}
              <span className="ml-2 text-gray-400 font-normal">({filteredUsers.length} người)</span>
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
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        Không có thành viên nào trong phòng ban này
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((row, index) => {
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
                    })
                  )}
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
