'use client';

import { StreakData } from '@/lib/types';

interface StreakGridProps {
  streak: StreakData;
}

export default function StreakGrid({ streak }: StreakGridProps) {
  const recentDays = streak.dailyStatus.slice(-33);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-6">
        <div>
          <p className="text-2xl font-black text-[#2c2f30]">🔥 {streak.currentStreak}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Day streak
          </p>
        </div>
        <div>
          <p className="text-2xl font-black text-[#2c2f30]">{streak.longestStreak}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Longest
          </p>
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {recentDays.map(day => (
          <div
            key={day.date}
            className="w-3 h-3 rounded-sm"
            title={day.date}
            style={{
              backgroundColor: day.isFuture
                ? 'transparent'
                : day.hasNote
                ? '#652fe7'
                : '#e0e3e4',
              border: day.isFuture ? '1px solid #dadddf' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
