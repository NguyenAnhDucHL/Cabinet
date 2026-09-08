import { Calendar, Users, ClipboardList, Activity, TrendingUp } from 'lucide-react'

const STAT_CONFIG = [
  {
    title: 'Tổng số phiên họp',
    key: 'totalMeetings',
    icon: Calendar,
    gradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-100 dark:border-blue-900',
    description: 'phiên họp đã tổ chức',
  },
  {
    title: 'Đang diễn ra',
    key: 'ongoingMeetings',
    icon: Activity,
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-100 dark:border-emerald-900',
    description: 'phiên đang hoạt động',
  },
  {
    title: 'Tổng lượt đại biểu',
    key: 'totalParticipants',
    icon: Users,
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50 dark:bg-violet-950/30',
    textColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'border-violet-100 dark:border-violet-900',
    description: 'lượt tham gia',
  },
  {
    title: 'Phiếu lấy ý kiến',
    key: 'totalQuestionnaires',
    icon: ClipboardList,
    gradient: 'from-orange-500 to-amber-600',
    bgLight: 'bg-orange-50 dark:bg-orange-950/30',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-100 dark:border-orange-900',
    description: 'phiếu đã tạo',
  },
]

export function StatCards({ overview }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_CONFIG.map((cfg, i) => {
        const Icon = cfg.icon
        const value = overview?.[cfg.key] ?? 0
        return (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl border ${cfg.borderColor} ${cfg.bgLight} p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
          >
            {/* Decorative blob */}
            <div
              className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${cfg.gradient} opacity-10 transition-all duration-300 group-hover:opacity-20 group-hover:scale-110`}
            />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {cfg.title}
                </p>
                <p className={`mt-2 text-4xl font-bold ${cfg.textColor}`}>
                  {value.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{cfg.description}</p>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.gradient} shadow-sm`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Bottom accent */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${cfg.gradient} transition-all duration-500 group-hover:w-full`}
            />
          </div>
        )
      })}
    </div>
  )
}
