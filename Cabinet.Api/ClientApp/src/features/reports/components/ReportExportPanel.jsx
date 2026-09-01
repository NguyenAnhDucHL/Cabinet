import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download } from 'lucide-react'

export function ReportExportPanel({ onExport }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleExport = () => {
    // If empty, pass null
    const s = startDate ? new Date(startDate).toISOString() : null
    const e = endDate ? new Date(endDate).toISOString() : null
    onExport(s, e)
  }

  return (
    <Card className="col-span-4 lg:col-span-1">
      <CardHeader>
        <CardTitle>Xuất báo cáo</CardTitle>
        <CardDescription>Tải dữ liệu danh sách phiên họp ra file CSV</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Từ ngày</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">Đến ngày</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button onClick={handleExport} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Tải xuống báo cáo
        </Button>
      </CardContent>
    </Card>
  )
}
