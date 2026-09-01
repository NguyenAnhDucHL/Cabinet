import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function MeetingCharts({ monthlyData }) {
  if (!monthlyData || monthlyData.length === 0) return null

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Biểu đồ số lượng phiên họp</CardTitle>
        <CardDescription>Thống kê số phiên họp đã tổ chức trong năm nay</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Bar
                dataKey="meetings"
                name="Số phiên họp"
                fill="var(--primary-color, #c8102e)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
