import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, ClipboardList, Activity } from 'lucide-react'

export function StatCards({ overview }) {
  if (!overview) return null

  const items = [
    {
      title: 'Tổng số phiên họp',
      value: overview.totalMeetings,
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: 'Đang diễn ra',
      value: overview.ongoingMeetings,
      icon: <Activity className="h-4 w-4 text-emerald-500" />,
    },
    {
      title: 'Tổng lượt đại biểu',
      value: overview.totalParticipants,
      icon: <Users className="h-4 w-4 text-blue-500" />,
    },
    {
      title: 'Phiếu lấy ý kiến',
      value: overview.totalQuestionnaires,
      icon: <ClipboardList className="h-4 w-4 text-orange-500" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
