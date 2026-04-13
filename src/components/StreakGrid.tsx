'use client';

import { StreakData } from '@/lib/types';

interface StreakGridProps {
  streak: StreakData;
}

export default function StreakGrid({ streak }: StreakGridProps) {
  const recentDays = streak.dailyStatus.slice(-33);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-white font-semibold">{streak.currentStreak} day streak</p>
            <p className="text-slate-400 text-sm">Longest: {streak.longestStreak} days</p>
          </div>
        </div>
      </div>
      <div className="flex gap-1 flex-wrap">
        {recentDays.map((day, i) => (
          <div
            key={day.date}
            className={`w-3 h-3 rounded-sm ${
              day.isFuture
                ? 'border border-slate-700'
                : day.hasNote
                ? 'bg-green-500'
                : 'bg-slate-800'
            }`}
            title={day.date}
          />
        ))}
      </div>
    </div>
  );
}
