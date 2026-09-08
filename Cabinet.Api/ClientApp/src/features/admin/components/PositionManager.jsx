import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

export function PositionManager() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })

  const [deleteId, setDeleteId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/positions')
      if (res.ok) {
        const json = await res.json()
        setPositions(json.data || [])
      }
    } catch (e) {
      toast.error('Lỗi khi tải danh sách chức vụ')
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (pos = null) => {
    if (pos) {
      setEditingId(pos.id)
      setForm({ name: pos.name, description: pos.description || '' })
    } else {
      setEditingId(null)
      setForm({ name: '', description: '' })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!form.name) return toast.error('Vui lòng nhập tên chức vụ')

    try {
      const isEdit = !!editingId
      const res = await fetch(
        isEdit ? `/api/admin/positions/${editingId}` : '/api/admin/positions',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(isEdit ? { id: editingId, ...form } : form),
        }
      )
      const json = await res.json()
      if (res.ok) {
        toast.success(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công')
        setIsOpen(false)
        fetchPositions()
      } else {
        toast.error(json.message || 'Có lỗi xảy ra')
      }
    } catch (e) {
      toast.error('Lỗi kết nối')
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/positions/${deleteId}`, { method: 'DELETE' })
      const json = await res.json()
      if (res.ok) {
        toast.success('Xóa thành công')
        setIsDeleteModalOpen(false)
        fetchPositions()
      } else {
        toast.error(json.message || 'Xóa thất bại')
      }
    } catch (e) {
      toast.error('Lỗi kết nối')
    }
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a202c]">Quản lý Chức vụ</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh mục các chức vụ trong hệ thống</p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="bg-[var(--color-primary)] hover:bg-[#a50e27] text-white gap-2"
        >
          <Plus size={16} /> Thêm chức vụ
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col shadow-sm border-0 ring-1 ring-gray-200">
        <CardContent className="p-0 overflow-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50/80 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-16">STT</TableHead>
                  <TableHead>Tên chức vụ</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right w-24">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      Chưa có dữ liệu chức vụ
                    </TableCell>
                  </TableRow>
                ) : (
                  positions.map((pos, i) => (
                    <TableRow key={pos.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-500">{i + 1}</TableCell>
                      <TableCell className="font-semibold text-gray-900">{pos.name}</TableCell>
                      <TableCell className="text-gray-600">{pos.description || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleOpen(pos)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setDeleteId(pos.id)
                              setIsDeleteModalOpen(true)
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Sửa chức vụ' : 'Thêm chức vụ mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>
                Tên chức vụ <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Giám đốc..."
              />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Mô tả ngắn gọn"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[var(--color-primary)] hover:bg-[#a50e27] text-white"
            >
              {editingId ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa chức vụ"
        description="Bạn có chắc chắn muốn xóa chức vụ này? Hành động này không thể hoàn tác."
        confirmText="Xóa chức vụ"
        cancelText="Hủy"
        variant="destructive"
      />
    </div>
  )
}
