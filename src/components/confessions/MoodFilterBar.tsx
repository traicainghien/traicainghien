"use client";

import React from 'react';

interface MoodFilterBarProps {
  activeMood: string;
  onSelectMood: (mood: string) => void;
  counts?: Record<string, number>;
}

const FILTERS = [
  { id: 'all', label: 'Tất cả', icon: '✨' },
  { id: 'xao_nhang', label: 'Xao nhãng số', icon: '🍃' },
  { id: 'tri_hoan', label: 'Trì hoãn', icon: '⏳' },
  { id: 'kiet_que', label: 'Kiệt quệ', icon: '🌧️' },
  { id: 'dan_vat', label: 'Tự trách', icon: '💔' },
  { id: 'hy_vong', label: 'Hy vọng', icon: '🌱' },
];

export default function MoodFilterBar({ activeMood, onSelectMood }: MoodFilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
      {FILTERS.map((item) => {
        const isActive = activeMood === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectMood(item.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              isActive
                ? 'bg-[#3A5A40] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#2D312E] border border-[#E6E1D8] hover:border-[#3A5A40]/40'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
