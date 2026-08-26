import React from 'react'

export function StatusToggle({ active, loading, onChange }) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      title={active ? 'Đang hoạt động' : 'Không hoạt động'}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
        loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'
      } ${active ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          active ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
