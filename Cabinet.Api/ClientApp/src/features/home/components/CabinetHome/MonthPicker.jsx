import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon, ChevronsLeft, ChevronsRight, X } from 'lucide-react'

export function MonthPicker({ selectedMonth, selectedYear, onChange }) {
  const [currentYear, setCurrentYear] = useState(selectedYear)
  const [isOpen, setIsOpen] = useState(false)

  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  const handleSelect = (m) => {
    onChange(m, currentYear)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-[#1a202c] hover:bg-gray-50 transition outline-none">
          {String(selectedMonth).padStart(2, '0')}/{selectedYear}
          <div className="flex items-center gap-1.5 ml-2 border-l border-gray-300 pl-2">
            <X
              size={14}
              className="text-gray-400 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation()
                onChange(null, null)
              }}
            />
            <CalendarIcon size={14} className="text-gray-500" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 rounded-xl shadow-xl" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => setCurrentYear((y) => y - 1)}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 transition"
          >
            <ChevronsLeft size={16} />
          </button>
          <span className="font-bold text-[#1a202c]">{currentYear}</span>
          <button
            onClick={() => setCurrentYear((y) => y + 1)}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 transition"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-4">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => handleSelect(m)}
              className={`py-2 rounded-md text-sm font-medium transition ${
                m === selectedMonth && currentYear === selectedYear
                  ? 'bg-[#c8102e] text-white'
                  : 'text-[#1a202c] hover:bg-gray-100'
              }`}
            >
              thg {m}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
