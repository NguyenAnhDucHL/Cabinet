import { useState, useEffect } from 'react'
import { reportApi } from '../api/reportApi'
import { toast } from 'sonner'
import { saveAs } from 'file-saver'

export function useReports() {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOverview = async () => {
    try {
      setLoading(true)
      const res = await reportApi.getOverview()
      if (res.success) {
        setOverview(res.data)
      }
    } catch (err) {
      toast.error('Không thể tải dữ liệu thống kê')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  const exportMeetings = async (startDate, endDate) => {
    try {
      const res = await reportApi.exportMeetings(startDate, endDate)
      if (res.success) {
        const data = res.data
        if (data.length === 0) {
          toast.info('Không có dữ liệu trong khoảng thời gian này.')
          return
        }

        // Convert to CSV
        const BOM = '\uFEFF'
        let csv =
          'ID,Tiêu đề,Bắt đầu,Kết thúc,Trạng thái,Địa điểm,Tổng đại biểu,Đã xác nhận tham gia\n'
        data.forEach((row) => {
          const safeTitle = `"${(row.title || '').replace(/"/g, '""')}"`
          const safeLocation = `"${(row.location || '').replace(/"/g, '""')}"`
          csv += `${row.id},${safeTitle},${row.startTime},${row.endTime},${row.status},${safeLocation},${row.totalInvited},${row.totalAttended}\n`
        })

        const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' })
        saveAs(blob, `bao-cao-phien-hop-${new Date().getTime()}.csv`)
        toast.success('Đã tải xuống báo cáo thành công!')
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tải báo cáo.')
    }
  }

  return { overview, loading, exportMeetings, refresh: fetchOverview }
}
