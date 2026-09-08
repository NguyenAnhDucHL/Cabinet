import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileDown, CalendarRange } from 'lucide-react'

export function ReportExportPanel({ onExport }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const s = startDate ? new Date(startDate).toISOString() : null
      const e = endDate ? new Date(endDate).toISOString() : null
      await onExport(s, e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="col-span-4 lg:col-span-1 flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 p-5 dark:border-gray-700">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
          <FileDown className="h-5 w-5 text-[var(--color-primary)]" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Xuất báo cáo</h3>
          <p className="text-xs text-gray-400">Tải dữ liệu ra file CSV</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Date range illustration */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-700/50">
          <CalendarRange className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Chọn khoảng thời gian</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={loading}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-sidebar-mid)] hover:shadow-md active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {loading ? 'Đang xuất...' : 'Tải xuống báo cáo'}
        </button>
      </div>
    </div>
  )
}
