import React from 'react'
import { Plus, X, UploadCloud, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Step3Contents({
  users,
  contentTabs,
  setContentTabs,
  activeContentTab,
  setActiveContentTab,
}) {
  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        {contentTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveContentTab(tab.id)}
            className={`flex items-center px-4 py-2 border-b-2 cursor-pointer transition-colors ${activeContentTab === tab.id ? 'border-[#c8102e] text-[#c8102e] font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700 font-medium'}`}
          >
            <span>{tab.title}</span>
            <X size={14} className="ml-2 text-gray-400 hover:text-red-500" />
          </div>
        ))}
        <button
          className="px-4 py-2 text-gray-500 hover:bg-gray-50 flex items-center justify-center border-b-2 border-transparent"
          onClick={() => {
            const newId = contentTabs.length > 0 ? Math.max(...contentTabs.map((t) => t.id)) + 1 : 1
            setContentTabs([...contentTabs, { id: newId, title: `Nội dung ${newId}` }])
            setActiveContentTab(newId)
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nội dung chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full h-32 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Nhập nội dung chi tiết..."
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Thời gian bắt đầu
            </label>
            <Input type="datetime-local" className="text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Thời gian kết thúc
            </label>
            <Input type="datetime-local" className="text-gray-500" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Người chuẩn bị tài liệu
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn người chuẩn bị" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id.toString()}>
                    {u.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Người duyệt tài liệu
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn người duyệt" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id.toString()}>
                    {u.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-gray-700">
              Danh sách tài liệu đính kèm
            </label>
            <button className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
              <Plus size={14} className="mr-1" /> Tạo thư mục
            </button>
          </div>
          <div className="border-2 border-dashed border-red-200 bg-red-50/30 rounded-lg p-6 text-center">
            <UploadCloud size={32} className="mx-auto text-red-400 mb-2" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-red-500 cursor-pointer">Chọn file</span> hoặc Kéo
              thả từ máy tính
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Tối đa 50MB, định dạng .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .msg, .mpp, .txt,
              .jpeg, .png, .tiff, .gif, .jpg, .bmp, .mp3, .mp4, .wmv, .flv, .avi
            </p>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Danh sách vấn đề cần biểu quyết
            </label>
            <button className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
              <Plus size={14} className="mr-1" /> Thêm vấn đề mới
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-center w-20">STT</th>
                  <th className="px-4 py-3">Vấn đề</th>
                  <th className="px-4 py-3 text-center">Phương thức biểu quyết</th>
                  <th className="px-4 py-3 text-center w-24">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-400 bg-gray-50/50">
                    <div className="flex justify-center mb-2">
                      <Info size={32} className="text-gray-300" />
                    </div>
                    Không có dữ liệu
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Thành phần tham dự
          </label>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Đơn vị</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Đơn vị 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Cá nhân</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cá nhân" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Khách mời</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Khách 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Nhóm thành viên
              </label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ban Chấp hành...</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
