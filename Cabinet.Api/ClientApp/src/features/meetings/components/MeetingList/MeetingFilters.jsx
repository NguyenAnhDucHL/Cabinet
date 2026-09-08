import React from 'react'
import { Search, Filter, RefreshCw, Calendar as CalendarIcon } from 'lucide-react'
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

export function MeetingFilters({ searchQuery, setSearchQuery, fetchMeetings }) {
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
        <Button variant="outline" size="icon" className="w-9 h-9 rounded-full text-gray-500">
          <Filter size={16} />
        </Button>
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
          <PopoverContent align="end" className="w-[320px] p-4 rounded-xl">
            <h3 className="font-bold text-gray-800 mb-4">Bộ lọc</h3>
            <div className="space-y-4">
              {[
                'Trạng thái tham gia',
                'Trạng thái phiên họp',
                'Loại phiên họp',
                'Hình thức họp',
              ].map((lbl) => (
                <div key={lbl} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">{lbl}</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <Button className="w-full bg-[var(--color-primary)] hover:bg-[#a50e27] text-white">
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
