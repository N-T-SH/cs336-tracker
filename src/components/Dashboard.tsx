'use client';

import { SiteData, Note, FocusTag } from '@/lib/types';
import FocusPill from './FocusPill';

// Solid fill colors per focus tag (for the progress squares)
const FOCUS_COLORS: Record<FocusTag, string> = {
  'lecture-notes':      '#3B82F6',
  'review-assignment':  '#F59E0B',
  'setup-environment':  '#64748B',
  'code-prototype':     '#22C55E',
  'study-prerequisite': '#A855F7',
  'optimize-impl':      '#F43F5E',
};

interface DashboardProps {
  data: SiteData;
  onNoteSelect: (note: Note) => void;
}

export default function Dashboard({ data, onNoteSelect }: DashboardProps) {
  const { config, stats, streak } = data;
  const today = new Date().toISOString().split('T')[0];
  const todayNote = data.notes.find(n => n.frontmatter.date === today);

  // Build per-day color data for progress squares
  const noteByDate = new Map<string, FocusTag>();
  for (const note of data.notes) {
    noteByDate.set(note.frontmatter.date, note.frontmatter.focus);
  }

  const totalFullCells = Math.floor(config.total_days); // 33
  const startDate = new Date(config.start_date + 'T00:00:00');

  const dayCells: { dateStr: string; focus: FocusTag | undefined; isFuture: boolean }[] = [];
  for (let i = 0; i < totalFullCells; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    dayCells.push({
      dateStr,
      focus: noteByDate.get(dateStr),
      isFuture: dateStr > today,
    });
  }

  const emptyColor = 'rgba(203,213,225,0.6)';

  return (
    <section className="max-w-[700px] mx-auto px-6 py-12">
      {/* About */}
      <div className="mb-10">
        <h1
          className="text-3xl font-black text-[#2c2f30] mb-3 leading-tight"
          style={{ letterSpacing: '-0.02em' }}
        >
          {config.about_line_1}
        </h1>
        <p className="text-[#595c5d] text-sm leading-relaxed">{config.about_line_2}</p>
      </div>

      {/* Progress squares */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Timeline Progress
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {stats.percentComplete}%
          </span>
        </div>

        <div className="flex flex-wrap gap-1 items-center">
          {dayCells.map(({ dateStr, focus, isFuture }) => (
            <div
              key={dateStr}
              className="progress-square"
              style={{
                backgroundColor:
                  focus && !isFuture ? FOCUS_COLORS[focus] : emptyColor,
              }}
              title={dateStr}
            />
          ))}
          {/* The 0.6-day half-square */}
          <div className="progress-half-square" style={{ backgroundColor: emptyColor }} />
        </div>
      </div>

      {/* Stats row */}
      <div
        className="flex gap-8 mb-10 pb-8"
        style={{ borderBottom: '1px solid #e6e8ea' }}
      >
        <div>
          <p className="text-2xl font-black text-[#2c2f30]">Day {stats.currentDay}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            of {config.total_days}
          </p>
        </div>
        <div>
          <p className="text-2xl font-black text-[#2c2f30]">{stats.totalHours.toFixed(1)}h</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            hours logged
          </p>
        </div>
        <div>
          <p className="text-2xl font-black text-[#2c2f30]">🔥 {streak.currentStreak}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            day streak
          </p>
        </div>
        <div>
          <p className="text-2xl font-black text-[#2c2f30]">{stats.totalNotes}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            notes filed
          </p>
        </div>
      </div>

      {/* Today's focus */}
      {todayNote ? (
        <div
          className="bg-white p-5 rounded-xl card-aberration border border-slate-100"
          style={{ borderColor: '#f1f5f9' }}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Today
            </span>
            <FocusPill focus={todayNote.frontmatter.focus} />
          </div>
          <h3
            className="text-lg font-black text-[#2c2f30] mb-1"
            style={{ letterSpacing: '-0.01em' }}
          >
            {todayNote.frontmatter.title}
          </h3>
          <p className="text-[#595c5d] text-sm mb-3">
            {todayNote.frontmatter.cs336_topic} · {todayNote.frontmatter.duration_hours}h
          </p>
          <button
            onClick={() => {
              onNoteSelect(todayNote);
              document.getElementById('note-viewer')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-sm font-bold transition-colors"
            style={{ color: '#652fe7' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#5819db')}
            onMouseLeave={e => (e.currentTarget.style.color = '#652fe7')}
          >
            Read today&apos;s note →
          </button>
        </div>
      ) : (
        <div className="text-[#595c5d] text-sm">
          <p className="font-medium text-[#2c2f30]">No note yet for today.</p>
          <p className="mt-1">Push a markdown file to the repo to log today&apos;s session.</p>
        </div>
      )}
    </section>
  );
}
