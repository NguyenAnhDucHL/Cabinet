import React from 'react'

export function CabinetLogo({ onClick }) {
  return (
    <div
      className="flex items-center gap-2.5 px-4 h-full min-w-[200px] cursor-pointer shrink-0"
      style={{ borderRight: '1px solid var(--color-sidebar-mid, #a50d25)' }}
      onClick={onClick}
    >
      <div className="w-9 h-9 rounded-sm bg-[var(--color-primary)] flex items-center justify-center border border-yellow-400 shrink-0">
        <svg viewBox="0 0 36 36" className="w-8 h-8">
          <rect width="36" height="36" fill="#da020b" />
          <polygon
            points="18,4 21.5,14.5 32,14.5 23.5,21 26.5,32 18,25.5 9.5,32 12.5,21 4,14.5 14.5,14.5"
            fill="#ffda00"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-sm text-white">iCPV Cabinet</span>
        <span className="text-[10px] text-red-200">Phòng họp không giấy</span>
      </div>
    </div>
  )
}
