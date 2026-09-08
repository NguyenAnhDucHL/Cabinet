import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

export function SystemConfigManager() {
  const [configs, setConfigs] = useState({
    PrimaryColor: '#c8102e',
    AppLogo: '/assets/logo.png',
    AppName: 'Cabinet Phòng họp không giấy',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/configs')
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setConfigs({ ...configs, ...json.data })
        }
      }
    } catch (e) {
      toast.error('Lỗi tải cấu hình')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/configs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(configs),
      })
      if (res.ok) {
        toast.success('Cập nhật cấu hình thành công. Vui lòng tải lại trang để áp dụng.')
        // Dispatch event if we want to apply color immediately without reload
        document.documentElement.style.setProperty('--primary-color', configs.PrimaryColor)
      } else {
        const json = await res.json()
        toast.error(json.message || 'Có lỗi xảy ra')
      }
    } catch (e) {
      toast.error('Lỗi kết nối')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a202c]">Cấu hình hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">
          Thiết lập logo, tên hệ thống và màu sắc chủ đạo
        </p>
      </div>

      <Card className="flex-1 shadow-sm border-0 ring-1 ring-gray-200">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Label className="text-gray-700 font-semibold mb-2 block">Tên hệ thống</Label>
                <Input
                  value={configs.AppName || ''}
                  onChange={(e) => setConfigs({ ...configs, AppName: e.target.value })}
                  placeholder="VD: Cabinet Phòng họp không giấy"
                  className="max-w-md"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-semibold mb-2 block">Logo URL</Label>
                <div className="flex gap-4 items-center">
                  <Input
                    value={configs.AppLogo || ''}
                    onChange={(e) => setConfigs({ ...configs, AppLogo: e.target.value })}
                    placeholder="/assets/logo.png hoặc https://..."
                    className="max-w-md"
                  />
                  {configs.AppLogo && (
                    <div className="h-10 px-4 bg-gray-100 rounded-lg flex items-center justify-center border">
                      <img
                        src={configs.AppLogo}
                        alt="Logo Preview"
                        className="max-h-8 object-contain"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-semibold mb-2 block">
                  Màu sắc chủ đạo (Primary Color)
                </Label>
                <div className="flex gap-4 items-center">
                  <Input
                    type="color"
                    value={configs.PrimaryColor || '#c8102e'}
                    onChange={(e) => setConfigs({ ...configs, PrimaryColor: e.target.value })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={configs.PrimaryColor || '#c8102e'}
                    onChange={(e) => setConfigs({ ...configs, PrimaryColor: e.target.value })}
                    className="w-32 uppercase"
                  />
                  <div className="text-sm text-gray-500">
                    Màu mặc định:{' '}
                    <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">#c8102e</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[var(--color-primary)] hover:bg-[#a50e27] text-white flex items-center gap-2"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Lưu cấu hình
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
