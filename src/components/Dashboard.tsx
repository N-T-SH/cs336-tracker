'use client';

import { useState, useEffect } from 'react';
import { SiteData, Note } from '@/lib/types';
import FocusPill from './FocusPill';

// ── Date helpers (always local, never UTC) ────────────────────────────────────

function localDateStr(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return localDateStr(new Date(y, m - 1, d + n));
}

function labelDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

// ── Color scale ───────────────────────────────────────────────────────────────

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(colorA: string, colorB: string, t: number): string {
  const [r1, g1, b1] = hexRgb(colorA);
  const [r2, g2, b2] = hexRgb(colorB);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bv = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bv})`;
}

/**
 * Map 0–20 study hours to a chromatic gradient:
 * low → teal (#00d7f0) → purple (#652fe7) → pink (#b60051) ← high
 */
function hourColor(hours: number): string {
  const t = Math.min(Math.max(hours, 0), 20) / 20;
  if (t < 0.5) return lerpColor('#00d7f0', '#652fe7', t * 2);
  return lerpColor('#652fe7', '#b60051', (t - 0.5) * 2);
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function Tooltip({ lines }: { lines: string[] }) {
  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1.5 rounded pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl min-w-max"
      style={{ backgroundColor: '#0c0f10' }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="whitespace-nowrap text-[10px] leading-snug"
          style={{ color: i === 0 ? '#ffffff' : '#9b9d9e', fontWeight: i === 0 ? 700 : 400 }}
        >
          {line}
        </div>
      ))}
      <span
        className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent"
        style={{ borderTopColor: '#0c0f10' }}
      />
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

interface DashboardProps {
  data: SiteData;
  onNoteSelect: (note: Note) => void;
  isNoteOpen?: boolean;
}

export default function Dashboard({ data, onNoteSelect, isNoteOpen = false }: DashboardProps) {
  const { config, stats } = data;
  const today = localDateStr(new Date());
  const todayNote = data.notes.find(n => n.frontmatter.date === today);

  const [gridOpen, setGridOpen] = useState(!isNoteOpen);
  useEffect(() => { setGridOpen(!isNoteOpen); }, [isNoteOpen]);

  const noteByDate = new Map<string, Note>();
  for (const note of data.notes) {
    if (!noteByDate.has(note.frontmatter.date)) noteByDate.set(note.frontmatter.date, note);
  }

  const COLS = 7;

  // 34 cells: 33 full sprint days + 1 fractional "sprint end" marker
  const cells = Array.from({ length: 34 }, (_, i) => {
    const dateStr = addDays(config.start_date, i);
    const note = noteByDate.get(dateStr);
    return {
      day: i + 1,
      dateStr,
      note,
      isFuture: dateStr > today,
      isToday: dateStr === today,
      isLast: i === 33,
    };
  });

  // Split into 5 rows of 7
  const rows: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += COLS) rows.push(cells.slice(i, i + COLS));

  return (
    <section className="max-w-[700px] mx-auto px-6 pt-12 pb-0">
      {/* About */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#2c2f30] mb-3 leading-tight" style={{ letterSpacing: '-0.02em' }}>
          {config.about_line_1}
        </h1>
        <p className="text-[#595c5d] text-sm leading-relaxed">{config.about_line_2}</p>
      </div>

      {/* ── Activity grid ─────────────────────────────────────────────────── */}
      <div className={`pb-6 ${todayNote ? 'mb-6' : 'mb-0'}`} style={{ borderBottom: '1px solid #e6e8ea' }}>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setGridOpen(o => !o)}
            className="flex items-center gap-1.5 group"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-500 transition-colors">
              Timeline Progress
            </span>
            <span className="text-[10px] text-slate-300 group-hover:text-slate-400 transition-colors select-none">
              {gridOpen ? '▲' : '▼'}
            </span>
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Day {stats.currentDay} of {config.total_days}
          </span>
        </div>

        {/* gap-[3px] on both axes → GitHub-style even spacing */}
        {gridOpen && <div className="flex flex-col gap-[3px]">
          {rows.map((row, wi) => {
            const weekLabel = config.week_labels[String(wi + 1)] ?? `Week ${wi + 1}`;
            const paddedRow: (typeof cells[0] | null)[] = [...row];
            while (paddedRow.length < COLS) paddedRow.push(null);

            return (
              <div key={wi} className="flex items-center gap-3">
                {/* Week label */}
                <div className="w-32 shrink-0 text-right">
                  <span className="text-[7px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                    {weekLabel}
                  </span>
                </div>

                {/* 7 fixed-size day squares */}
                <div className="flex gap-[3px]">
                  {paddedRow.map((cell, ci) => {
                    // Empty padding (last row)
                    if (cell === null) {
                      return <div key={`pad-${ci}`} className="w-3 h-3 rounded-[2px]" style={{ background: 'transparent' }} />;
                    }

                    // Last cell — chromatic sprint-end marker
                    if (cell.isLast) {
                      return (
                        <div key="last" className="relative group cursor-default">
                          <div
                            className="w-3 h-3 rounded-[2px] transition-transform group-hover:scale-125"
                            style={{
                              background: 'linear-gradient(135deg, #006571 0%, #652fe7 50%, #b60051 100%)',
                              boxShadow: '1px 0 0 rgba(255,0,0,0.7), -1px 0 0 rgba(0,255,255,0.7)',
                              opacity: 0.8,
                            }}
                          />
                          <Tooltip lines={['Day 34 · Sprint end', '0.6-day finish line']} />
                        </div>
                      );
                    }

                    const { note, isFuture, isToday, day, dateStr } = cell;

                    // Color logic
                    let bg: string;
                    if (isFuture) {
                      bg = '#e0e3e4';                // light grey — not yet
                    } else if (!note && isToday) {
                      bg = '#c8d0d8';                // mid grey — today, no note yet
                    } else if (!note) {
                      bg = '#F59E0B';                // loud amber — gap / missed day
                    } else {
                      bg = hourColor(note.frontmatter.duration_hours);
                    }

                    const opacity = isFuture ? 0.45 : 1;

                    // Tooltip lines
                    const tLines: string[] = [`Day ${day} · ${labelDate(dateStr)}`];
                    if (note) {
                      tLines.push(note.frontmatter.title);
                      tLines.push(`${note.frontmatter.duration_hours}h`);
                    } else if (isFuture) {
                      tLines.push('Coming up');
                    } else if (isToday) {
                      tLines.push('No note yet today');
                    } else {
                      tLines.push('Gap — no note logged');
                    }

                    return (
                      <div
                        key={dateStr}
                        className={`relative group ${note ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={note ? () => onNoteSelect(note) : undefined}
                      >
                        <div
                          className={`w-3 h-3 rounded-[2px] transition-transform group-hover:scale-125 ${isToday ? 'ring-[1.5px] ring-[#2c2f30] ring-offset-[1px] ring-offset-[#f7f6f2]' : ''}`}
                          style={{ backgroundColor: bg, opacity }}
                        />
                        <Tooltip lines={tLines} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>}
      </div>

      {/* ── Today's focus ────────────────────────────────────────────────── */}
      {todayNote && (
        <div className="bg-white p-5 rounded-xl card-aberration" style={{ border: '1px solid #f1f5f9' }}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Today</span>
            <FocusPill focus={todayNote.frontmatter.focus} />
          </div>
          <h3 className="text-lg font-black text-[#2c2f30] mb-1" style={{ letterSpacing: '-0.01em' }}>
            {todayNote.frontmatter.title}
          </h3>
          <p className="text-[#595c5d] text-sm mb-3">
            {todayNote.frontmatter.duration_hours}h
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
      )}
    </section>
  );
}
