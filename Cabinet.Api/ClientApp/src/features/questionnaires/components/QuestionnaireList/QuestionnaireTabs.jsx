import React from 'react'
import { TABS } from '../../constants/questionnaire'

export function QuestionnaireTabs({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white px-6 border-b border-gray-200 shrink-0">
      <div className="flex gap-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 text-sm font-medium border-b-2 transition-colors relative ${
              activeTab === tab.id
                ? 'border-[#c8102e] text-[#c8102e]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-[#c8102e] rounded-t-full shadow-[0_-2px_8px_rgba(200,16,46,0.5)]"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
