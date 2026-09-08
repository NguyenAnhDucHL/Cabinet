import React from 'react'
import { useReports } from '../../features/reports/hooks/useReports'
import { StatCards } from '../../features/reports/components/StatCards'
import { MeetingCharts } from '../../features/reports/components/MeetingCharts'
import { ReportExportPanel } from '../../features/reports/components/ReportExportPanel'
import { BarChart2 } from 'lucide-react'

function SkeletonCard({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800 ${className}`} />
}

export function CabinetReports() {
  const { overview, loading, exportMeetings } = useReports()

  return (
    <div className="space-y-7">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10">
          <BarChart2 className="h-6 w-6 text-[var(--color-primary)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Báo cáo &amp; Thống kê
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Tổng hợp số liệu các phiên họp và xuất báo cáo dữ liệu.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-5">
          {/* Stat skeletons */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} className="h-[108px]" />
            ))}
          </div>
          {/* Chart + panel skeletons */}
          <div className="grid gap-4 md:grid-cols-4">
            <SkeletonCard className="col-span-4 lg:col-span-3 h-[400px]" />
            <SkeletonCard className="col-span-4 lg:col-span-1 h-[400px]" />
          </div>
        </div>
      ) : (
        <>
          <StatCards overview={overview} />

          <div className="grid gap-4 md:grid-cols-4">
            <MeetingCharts monthlyData={overview?.monthlyMeetings} />
            <ReportExportPanel onExport={exportMeetings} />
          </div>
        </>
      )}
    </div>
  )
}
