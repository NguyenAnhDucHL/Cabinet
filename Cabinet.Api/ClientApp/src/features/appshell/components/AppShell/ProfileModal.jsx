import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { User, X, Edit, Image as ImageIcon, LogOut, ChevronLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function ProfileModal({
  isOpen,
  onClose,
  userName,
  userLoginName,
  userLastLogin,
  onLogout,
}) {
  const [mode, setMode] = useState('view') // 'view' | 'edit'
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    oldPassword: '',
    newPassword: '',
  })

  useEffect(() => {
    if (isOpen && mode === 'edit') {
      fetchProfile()
    }
  }, [isOpen, mode])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      })
      if (res.ok) {
        const data = await res.json()
        setProfile({
          fullName: data.data.fullName || '',
          email: data.data.email || '',
          phoneNumber: data.data.phoneNumber || '',
          oldPassword: '',
          newPassword: '',
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(profile),
      })
      const json = await res.json()
      if (res.ok) {
        toast.success(json.message || 'Cập nhật thông tin thành công!')
        setMode('view')
      } else {
        toast.error(json.message || 'Có lỗi xảy ra')
      }
    } catch (e) {
      toast.error('Lỗi kết nối')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setMode('view')
    onClose(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[450px] p-0 overflow-hidden border-0 rounded-xl bg-white">
        <div className="bg-[#c8102e] text-white pt-10 pb-6 px-6 relative flex flex-col items-center">
          {mode === 'edit' ? (
            <button
              onClick={() => setMode('view')}
              className="absolute top-4 left-4 text-white hover:opacity-80 outline-none flex items-center text-sm"
            >
              <ChevronLeft size={20} className="mr-1" /> Quay lại
            </button>
          ) : (
            <h2 className="absolute top-4 left-6 font-bold text-lg">Hồ sơ cá nhân</h2>
          )}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:opacity-80 outline-none"
          >
            <X size={20} />
          </button>

          {mode === 'view' && (
            <>
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white mb-3 mt-4 overflow-hidden flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
              <h3 className="font-bold text-xl mb-1">{userName}</h3>
              <p className="text-sm opacity-90">
                {userLastLogin === 'Lần đầu đăng nhập'
                  ? userLastLogin
                  : `Lần đăng nhập gần nhất ${userLastLogin}`}
              </p>
            </>
          )}
          {mode === 'edit' && <h3 className="font-bold text-xl mt-4 mb-2">Chỉnh sửa hồ sơ</h3>}
        </div>

        <div className="p-6">
          {mode === 'view' ? (
            <>
              <h4 className="font-bold text-[#1a202c] text-base mb-4">Hồ sơ cá nhân</h4>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Tên đăng nhập</span>
                  <span className="font-semibold text-[#1a202c]">{userLoginName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Tên đại biểu</span>
                  <span className="font-semibold text-[#1a202c]">{userName}</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-6" />

              <h4 className="font-bold text-[#1a202c] text-base mb-4">Cài đặt</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setMode('edit')}
                  className="w-full flex items-center justify-between px-2 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Edit size={18} className="text-gray-500" />
                    <span className="font-medium text-[#1a202c]">Chỉnh sửa hồ sơ</span>
                  </div>
                  <ChevronLeft
                    size={18}
                    className="text-gray-400 rotate-180 group-hover:text-gray-600"
                  />
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-between px-2 py-3 hover:bg-red-50 rounded-lg transition-colors mt-2"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} className="text-[#c8102e]" />
                    <span className="font-medium text-[#c8102e]">Đăng xuất</span>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-sm text-gray-500 py-4">Đang tải...</div>
              ) : (
                <>
                  <div>
                    <Label className="text-gray-600 mb-1.5 block">Họ và tên</Label>
                    <Input
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-600 mb-1.5 block">Email</Label>
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="Nhập email"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-600 mb-1.5 block">Số điện thoại</Label>
                    <Input
                      value={profile.phoneNumber}
                      onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="h-px bg-gray-100 my-4" />
                  <h4 className="font-bold text-[#1a202c] text-sm mb-2">
                    Đổi mật khẩu (Bỏ trống nếu không đổi)
                  </h4>
                  <div>
                    <Label className="text-gray-600 mb-1.5 block">Mật khẩu hiện tại</Label>
                    <Input
                      type="password"
                      value={profile.oldPassword}
                      onChange={(e) => setProfile({ ...profile, oldPassword: e.target.value })}
                      placeholder="Nhập mật khẩu cũ"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-600 mb-1.5 block">Mật khẩu mới</Label>
                    <Input
                      type="password"
                      value={profile.newPassword}
                      onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-[#c8102e] hover:bg-[#a50e27] text-white mt-4"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
