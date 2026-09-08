import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { BarChart2 } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-bold text-[var(--color-primary)]">
          {payload[0].value} <span className="text-sm font-normal text-gray-400">phiên họp</span>
        </p>
      </div>
    )
  }
  return null
}

export function MeetingCharts({ monthlyData }) {
  const hasData = monthlyData && monthlyData.length > 0
  const maxVal = hasData ? Math.max(...monthlyData.map((d) => d.meetings)) : 0

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800 col-span-4 lg:col-span-3">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 p-5 dark:border-gray-700">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
          <BarChart2 className="h-5 w-5 text-[var(--color-primary)]" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Biểu đồ phiên họp</h3>
          <p className="text-xs text-gray-400">Thống kê số phiên họp đã tổ chức trong năm nay</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-5">
        {!hasData ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="text-center">
              <BarChart2 className="mx-auto h-12 w-12 text-gray-200 dark:text-gray-600" />
              <p className="mt-3 text-sm text-gray-400">Chưa có dữ liệu biểu đồ</p>
            </div>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  stroke="#aaa"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#aaa"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,16,46,0.05)' }} />
                <Bar dataKey="meetings" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {monthlyData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.meetings === maxVal ? '#c8102e' : 'rgba(200,16,46,0.18)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
