import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useReports } from '../../features/reports/hooks/useReports'
import { StatCards } from '../../features/reports/components/StatCards'
import { MeetingCharts } from '../../features/reports/components/MeetingCharts'
import { ReportExportPanel } from '../../features/reports/components/ReportExportPanel'

export function CabinetReports() {
  const { overview, loading, exportMeetings } = useReports()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Báo cáo & Thống kê</h1>
        <p className="text-muted-foreground mt-2">
          Tổng hợp số liệu các phiên họp và xuất báo cáo dữ liệu.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
            <Skeleton className="h-[400px] col-span-4 lg:col-span-3 rounded-xl" />
            <Skeleton className="h-[400px] col-span-4 lg:col-span-1 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          <StatCards overview={overview} />

          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
            <MeetingCharts monthlyData={overview?.monthlyMeetings} />
            <ReportExportPanel onExport={exportMeetings} />
          </div>
        </>
      )}
    </div>
  )
}
