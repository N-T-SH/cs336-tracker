'use client';

import { SiteData, Note } from '@/lib/types';
import FocusPill from './FocusPill';
import StreakGrid from './StreakGrid';

interface DashboardProps {
  data: SiteData;
  onNoteSelect: (note: Note) => void;
}

export default function Dashboard({ data, onNoteSelect }: DashboardProps) {
  const { config, stats, streak } = data;
  
  // Find today's note
  const today = new Date().toISOString().split('T')[0];
  const todayNote = data.notes.find(n => n.frontmatter.date === today);
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* About Block */}
      <div className="mb-12 text-center">
        <p className="text-lg text-slate-300 mb-2">{config.about_line_1}</p>
        <p className="text-slate-400">{config.about_line_2}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Progress Card */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">
            Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">Day {stats.currentDay}</span>
                <span className="text-slate-500">of {config.total_days}</span>
              </div>
              <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(100, (stats.currentDay / config.total_days) * 100)}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <p className="text-2xl font-bold text-white">{stats.percentComplete}%</p>
                <p className="text-slate-400 text-sm">Notes filed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalHours.toFixed(1)}</p>
                <p className="text-slate-400 text-sm">Hours logged</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Streak Card */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">
            Streak
          </h3>
          <StreakGrid streak={streak} />
        </div>
        
        {/* Today's Focus Card */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">
            Today&apos;s Focus
          </h3>
          {todayNote ? (
            <div className="space-y-3">
              <p className="text-white font-semibold">{todayNote.frontmatter.title}</p>
              <p className="text-slate-400 text-sm">{todayNote.frontmatter.cs336_topic}</p>
              <div className="flex items-center gap-2">
                <FocusPill focus={todayNote.frontmatter.focus} />
                <span className="text-slate-500 text-sm">{todayNote.frontmatter.duration_hours}h</span>
              </div>
              <button
                onClick={() => onNoteSelect(todayNote)}
                className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
              >
                Read today&apos;s note →
              </button>
            </div>
          ) : (
            <div className="text-slate-500">
              <p>No note yet for today</p>
              <p className="text-sm mt-1">Push a note to get started!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
