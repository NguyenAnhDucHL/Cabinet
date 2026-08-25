import React from 'react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative mb-3">
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 65 L80 65 L75 85 L25 85 Z"
            fill="#e2e8f0"
            stroke="#64748b"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M30 45 L70 45 L70 65 L30 65 Z"
            fill="#f8fafc"
            stroke="#64748b"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M40 50 L60 50 M40 55 L50 55"
            stroke="#64748b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="70" cy="35" r="10" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
          <path
            d="M66 35 L74 35 M70 31 L70 39"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-sm font-bold text-[#1a202c]">Không có dữ liệu</p>
    </div>
  )
}
