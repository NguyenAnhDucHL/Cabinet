import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Check, Palette } from 'lucide-react'
import { THEMES, applyTheme, getCurrentTheme } from '@/lib/theme.js'

export function ThemeModal({ isOpen, onClose }) {
  const [selected, setSelected] = useState(getCurrentTheme)

  const handleSelect = (themeId) => {
    setSelected(themeId)
    applyTheme(themeId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[520px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0 bg-white">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'var(--color-primary, #c8102e)' + '15' }}
            >
              <Palette className="h-5 w-5" style={{ color: 'var(--color-primary, #c8102e)' }} />
            </div>
            <div>
              <DialogTitle className="text-[#1a202c] text-lg font-bold leading-tight">
                Thay đổi màu sắc
              </DialogTitle>
              <p className="text-xs text-gray-400 mt-0.5">
                Chọn gam màu phù hợp với tổ chức của bạn
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Divider */}
        <div className="h-px bg-gray-100 mx-6 mt-4" />

        {/* Theme Options */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((theme) => {
              const isActive = selected === theme.id
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelect(theme.id)}
                  className={`
                    relative flex flex-col items-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-200
                    ${isActive ? 'border-current shadow-md scale-[1.02]' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}
                  `}
                  style={isActive ? { borderColor: theme.primary } : {}}
                >
                  {/* Color preview gradient */}
                  <div className="w-full h-14 rounded-lg overflow-hidden relative">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${theme.preview[0]} 0%, ${theme.preview[1]} 50%, ${theme.preview[2]} 100%)`,
                      }}
                    />
                    {/* Simulated topbar stripe */}
                    <div
                      className="absolute top-0 left-0 right-0 h-4"
                      style={{ background: theme.preview[0] }}
                    />
                    {/* Simulated sidebar stripe */}
                    <div
                      className="absolute left-0 top-4 bottom-0 w-6"
                      style={{
                        background: `linear-gradient(180deg, ${theme.preview[0]}, ${theme.preview[2]})`,
                      }}
                    />
                    {/* Content area */}
                    <div className="absolute right-1.5 top-6 bottom-1.5 left-8 bg-white/30 rounded-sm" />
                  </div>

                  {/* Name */}
                  <span
                    className="text-xs font-semibold text-center leading-tight"
                    style={{ color: theme.textColor }}
                  >
                    {theme.name}
                  </span>

                  {/* Active checkmark */}
                  {isActive && (
                    <div
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center shadow-md"
                      style={{ background: theme.primary }}
                    >
                      <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Apply info */}
          <p className="mt-4 text-center text-xs text-gray-400">
            ✓ Màu sắc được áp dụng ngay lập tức và lưu tự động
          </p>

          {/* Close button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => onClose(false)}
              className="px-8 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all hover:shadow-md hover:opacity-90 active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, var(--color-primary, #c8102e), var(--color-sidebar-mid, #a50d25))`,
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
