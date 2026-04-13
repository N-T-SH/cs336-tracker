'use client';

import { SiteData, Note, FocusTag } from '@/lib/types';
import FocusPill from './FocusPill';

const FOCUS_COLORS: Record<FocusTag, string> = {
  'lecture-notes':      '#3B82F6',
  'review-assignment':  '#F59E0B',
  'setup-environment':  '#64748B',
  'code-prototype':     '#22C55E',
  'study-prerequisite': '#A855F7',
  'optimize-impl':      '#F43F5E',
};

const FOCUS_LABELS: Record<FocusTag, string> = {
  'lecture-notes':      'Lecture Notes',
  'review-assignment':  'Review / Assignment',
  'setup-environment':  'Setup & Environment',
  'code-prototype':     'Code Prototype',
  'study-prerequisite': 'Study Prerequisite',
  'optimize-impl':      'Optimize Implementation',
};

interface DashboardProps {
  data: SiteData;
  onNoteSelect: (note: Note) => void;
}

// ── Tooltip cell ──────────────────────────────────────────────────────────────
interface CellProps {
  bg: string;
  shadow?: string;
  opacity?: number;
  tooltip: string;
  isLast?: boolean;
  cursor?: string;
  onClick?: () => void;
}

function ActivityCell({ bg, shadow, opacity = 1, tooltip, isLast, cursor = 'default', onClick }: CellProps) {
  return (
    <div
      className="relative group"
      style={{ cursor }}
      onClick={onClick}
    >
      {/* The square */}
      <div
        className="w-6 h-6 rounded-sm transition-transform group-hover:scale-110"
        style={{
          background: bg,
          boxShadow: shadow,
          opacity,
        }}
      />
      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-white text-[10px] font-medium whitespace-nowrap pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        style={{ backgroundColor: '#0c0f10' }}
      >
        {tooltip}
        {/* Arrow */}
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
          style={{ borderTopColor: '#0c0f10' }}
        />
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard({ data, onNoteSelect }: DashboardProps) {
  const { config, stats, streak } = data;
  const today = new Date().toISOString().split('T')[0];
  const todayNote = data.notes.find(n => n.frontmatter.date === today);

  // Map date → first note
  const noteByDate = new Map<string, Note>();
  for (const note of data.notes) {
    if (!noteByDate.has(note.frontmatter.date)) {
      noteByDate.set(note.frontmatter.date, note);
    }
  }

  const startDate = new Date(config.start_date + 'T00:00:00');

  // Build 34 day cells (33 full days + 1 fractional "sprint end")
  const cells = Array.from({ length: 34 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const note = noteByDate.get(dateStr);
    const isFuture = dateStr > today;
    const isLast = i === 33; // the 0.6-day fractional end
    return { day: i + 1, dateStr, note, isFuture, isLast };
  });

  // Group into 5 weeks of 7 (last row: 6 real cells + empty padding)
  const COLS = 7;
  const rows: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += COLS) {
    rows.push(cells.slice(i, i + COLS));
  }

  const emptyColor = 'rgba(203,213,225,0.5)';
  const futureColor = 'transparent';

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

      {/* ── Activity grid ────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Timeline Progress
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {stats.percentComplete}%
          </span>
        </div>

        <div className="space-y-1.5">
          {rows.map((row, wi) => {
            const weekNum = wi + 1;
            const weekLabel = config.week_labels[String(weekNum)] ?? `Week ${weekNum}`;

            // Pad last row to COLS length with null placeholders
            const paddedRow: (typeof cells[0] | null)[] = [...row];
            while (paddedRow.length < COLS) paddedRow.push(null);

            return (
              <div key={wi} className="flex items-center gap-3">
                {/* Week label — left column */}
                <div className="w-28 shrink-0 text-right">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-tight"
                    title={`Week ${weekNum}`}
                  >
                    {weekLabel}
                  </span>
                </div>

                {/* 7 day cells */}
                <div className="flex gap-1.5">
                  {paddedRow.map((cell, ci) => {
                    if (cell === null) {
                      // Empty padding cell (no 35th day)
                      return (
                        <div
                          key={`pad-${ci}`}
                          className="w-6 h-6 rounded-sm"
                          style={{ backgroundColor: 'transparent' }}
                        />
                      );
                    }

                    // Last cell — chromatic aberration "sprint end" marker
                    if (cell.isLast) {
                      return (
                        <ActivityCell
                          key={cell.dateStr}
                          bg="linear-gradient(135deg, #006571 0%, #652fe7 50%, #b60051 100%)"
                          shadow="2px 0 0 rgba(255,0,0,0.55), -2px 0 0 rgba(0,255,255,0.55)"
                          opacity={0.75}
                          tooltip="Day 34 — Sprint end (0.6 day)"
                          isLast
                          cursor="default"
                        />
                      );
                    }

                    // Normal cells
                    const { note, isFuture, day, dateStr } = cell;
                    const hasFocus = note?.frontmatter.focus;

                    const bg = isFuture
                      ? futureColor
                      : hasFocus
                      ? FOCUS_COLORS[hasFocus]
                      : emptyColor;

                    const border = isFuture ? '1px solid #dadddf' : 'none';

                    const tooltip = note
                      ? `Day ${day} — ${note.frontmatter.title}\n${FOCUS_LABELS[note.frontmatter.focus]}`
                      : isFuture
                      ? `Day ${day}`
                      : `Day ${day} — no note yet`;

                    return (
                      <ActivityCell
                        key={dateStr}
                        bg={bg}
                        shadow={border ? undefined : undefined}
                        tooltip={tooltip}
                        cursor={note ? 'pointer' : 'default'}
                        onClick={note ? () => onNoteSelect(note) : undefined}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Stats row ────────────────────────────────────────────────────── */}
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

      {/* ── Today's focus ────────────────────────────────────────────────── */}
      {todayNote ? (
        <div
          className="bg-white p-5 rounded-xl card-aberration"
          style={{ border: '1px solid #f1f5f9' }}
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
          >
            Read today&apos;s note →
          </button>
        </div>
      ) : (
        <p className="text-sm text-[#595c5d]">
          <span className="font-medium text-[#2c2f30]">No note yet for today.</span>{' '}
          Push a markdown file to log today&apos;s session.
        </p>
      )}
    </section>
  );
}
