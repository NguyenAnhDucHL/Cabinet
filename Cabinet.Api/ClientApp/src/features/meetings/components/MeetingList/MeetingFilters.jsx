import React from 'react'
import {
  Search,
  Filter,
  RefreshCw,
  Calendar as CalendarIcon,
  SlidersHorizontal,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function MeetingFilters({
  meetings = [],
  searchQuery,
  setSearchQuery,
  fetchMeetings,
  filters,
  setFilters,
  visibleColumns,
  setVisibleColumns,
}) {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const uniqueLocations = [
    ...new Set(meetings.map((m) => m.location || m.roomName).filter(Boolean)),
  ]
  const uniquePresiders = [...new Set(meetings.map((m) => m.presider).filter(Boolean))]
  const uniqueTypes = [...new Set(meetings.map((m) => m.meetingType).filter(Boolean))]

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <h2 className="text-lg font-bold text-gray-800">Danh sách phiên họp</h2>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Tìm kiếm theo tên phiên họp..."
            className="pl-9 w-[280px] h-9 text-sm rounded-full bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 rounded-full text-[#c8102e] border-[#c8102e] bg-red-50 hover:bg-red-100 shrink-0"
            >
              <SlidersHorizontal size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            collisionPadding={16}
            style={{ maxHeight: 'var(--radix-popover-content-available-height, 80vh)' }}
            className="w-[220px] p-0 rounded-xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800">Cấu hình hiển thị cột</h3>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Checkbox
                  checked={Object.values(visibleColumns).every((v) => v)}
                  onCheckedChange={(checked) => {
                    setVisibleColumns({
                      stt: checked,
                      time: checked,
                      title: checked,
                      location: checked,
                      presider: checked,
                      type: checked,
                      status: checked,
                      format: checked,
                      actions: checked,
                    })
                  }}
                  className="data-[state=checked]:bg-[#c8102e] data-[state=checked]:border-[#c8102e]"
                />
                Hiển thị tất cả
              </label>
              {[
                { key: 'stt', label: 'STT' },
                { key: 'time', label: 'Thời gian họp' },
                { key: 'title', label: 'Tên phiên họp' },
                { key: 'location', label: 'Địa điểm họp' },
                { key: 'presider', label: 'Chủ trì cuộc họp' },
                { key: 'type', label: 'Loại phiên họp' },
                { key: 'status', label: 'Trạng thái tham gia' },
                { key: 'actions', label: 'Hành động' },
              ].map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-2 text-sm cursor-pointer text-gray-700"
                >
                  <Checkbox
                    checked={visibleColumns[col.key]}
                    onCheckedChange={(checked) =>
                      setVisibleColumns((prev) => ({ ...prev, [col.key]: checked }))
                    }
                    className="data-[state=checked]:bg-[#c8102e] data-[state=checked]:border-[#c8102e]"
                  />
                  {col.label}
                </label>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 shrink-0">
              <Button
                className="w-full bg-[#c8102e] hover:bg-[#a50e27] text-white"
                onClick={() =>
                  setVisibleColumns({
                    stt: true,
                    time: true,
                    title: true,
                    location: true,
                    presider: true,
                    type: true,
                    status: true,
                    actions: true,
                  })
                }
              >
                Cài lại
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 rounded-full text-gray-500"
          onClick={fetchMeetings}
        >
          <RefreshCw size={16} />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 text-[var(--color-primary)] border-[var(--color-primary)] hover:bg-red-50 rounded-full px-4"
            >
              <Filter size={14} className="mr-2" />
              Bộ lọc
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            collisionPadding={16}
            style={{ maxHeight: 'var(--radix-popover-content-available-height, 80vh)' }}
            className="w-[320px] p-0 rounded-xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800">Bộ lọc</h3>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Trạng thái tham gia</label>
                <Select
                  value={filters?.attendanceStatus || 'all'}
                  onValueChange={(val) => updateFilter('attendanceStatus', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Tham gia">Tham gia</SelectItem>
                    <SelectItem value="Chưa xác nhận">Chưa xác nhận</SelectItem>
                    <SelectItem value="Vắng mặt">Vắng mặt</SelectItem>
                    <SelectItem value="Báo vắng">Báo vắng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Trạng thái phiên họp</label>
                <Select
                  value={filters?.status || 'all'}
                  onValueChange={(val) => updateFilter('status', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                    <SelectItem value="Đang diễn ra">Đang diễn ra</SelectItem>
                    <SelectItem value="Đã họp">Đã họp</SelectItem>
                    <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Địa điểm</label>
                <Select
                  value={filters?.location || 'all'}
                  onValueChange={(val) => updateFilter('location', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {uniqueLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Chủ trì</label>
                <Select
                  value={filters?.presider || 'all'}
                  onValueChange={(val) => updateFilter('presider', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {uniquePresiders.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Loại phiên họp</label>
                <Select
                  value={filters?.type || 'all'}
                  onValueChange={(val) => updateFilter('type', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {uniqueTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Hình thức họp</label>
                <Select
                  value={filters?.format || 'all'}
                  onValueChange={(val) => updateFilter('format', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Họp thường">Họp thường</SelectItem>
                    <SelectItem value="Họp trực tuyến">Họp trực tuyến</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 shrink-0">
              <Button
                className="w-full bg-[#c8102e] hover:bg-[#a50e27] text-white"
                onClick={fetchMeetings}
              >
                Lọc dữ liệu
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 text-[var(--color-primary)] border-[var(--color-primary)] hover:bg-red-50 rounded-full px-4"
            >
              <CalendarIcon size={14} className="mr-2" />
              Thời gian
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[280px] p-4 rounded-xl">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Từ ngày</label>
                <Input type="date" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Đến ngày</label>
                <Input type="date" className="h-9 text-sm" />
              </div>
              <Button className="w-full bg-[var(--color-primary)] hover:bg-[#a50e27] text-white mt-2">
                Lọc dữ liệu
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
