'use client';

import { SiteData, Note, FocusTag } from '@/lib/types';

const FOCUS_COLORS: Record<FocusTag, string> = {
  'lecture-notes':      '#3B82F6',
  'review-assignment':  '#F59E0B',
  'setup-environment':  '#64748B',
  'code-prototype':     '#22C55E',
  'study-prerequisite': '#A855F7',
  'optimize-impl':      '#F43F5E',
};

interface TimelineProps {
  data: SiteData;
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
}

export default function Timeline({ data, selectedNote, onNoteSelect }: TimelineProps) {
  const { config, notes } = data;

  // Group notes by date
  const notesByDate = new Map<string, Note[]>();
  for (const note of notes) {
    const d = note.frontmatter.date;
    if (!notesByDate.has(d)) notesByDate.set(d, []);
    notesByDate.get(d)!.push(note);
  }

  const totalCells = Math.ceil(config.total_days);
  const startDate = new Date(config.start_date + 'T00:00:00');
  const today = new Date().toISOString().split('T')[0];

  // Build all day objects
  const days = Array.from({ length: totalCells }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayNotes = notesByDate.get(dateStr) ?? [];
    return {
      day: i + 1,
      date: dateStr,
      notes: dayNotes,
      isToday: dateStr === today,
      isFuture: dateStr > today,
      week: Math.floor(i / 7) + 1,
    };
  });

  // Split into weeks
  const weeks: (typeof days)[] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <section style={{ borderTop: '1px solid #e6e8ea' }} className="py-10">
      <div className="max-w-[700px] mx-auto px-6">
        {/* Section label */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Full Timeline
        </span>

        <div className="space-y-6 mt-5">
          {weeks.map((week, wi) => (
            <div key={wi} className="space-y-2">
              {/* Week header */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Week {wi + 1}
                </span>
                {config.week_labels[String(wi + 1)] && (
                  <span className="text-[10px] text-slate-400">
                    — {config.week_labels[String(wi + 1)]}
                  </span>
                )}
              </div>

              {/* Day cells */}
              <div className="flex gap-1">
                {week.map(day => {
                  const primaryNote = day.notes[0];
                  const isSelected =
                    selectedNote != null &&
                    day.notes.some(n => n.slug === selectedNote.slug);

                  const bg = day.isFuture
                    ? 'transparent'
                    : day.notes.length > 0
                    ? FOCUS_COLORS[primaryNote?.frontmatter.focus ?? 'lecture-notes']
                    : '#e0e3e4';

                  return (
                    <div
                      key={day.date}
                      onClick={() => day.notes.length > 0 && onNoteSelect(day.notes[0])}
                      title={
                        day.notes.length > 0
                          ? day.notes[0].frontmatter.title
                          : `Day ${day.day} — no note`
                      }
                      className={[
                        'flex-1 h-14 rounded-lg transition-all',
                        day.notes.length > 0 ? 'cursor-pointer hover:opacity-80 hover:scale-105' : 'cursor-default',
                        day.isFuture ? 'border border-[#dadddf]' : '',
                        day.isToday ? 'ring-2 ring-[#2c2f30]' : '',
                        isSelected ? 'ring-2 ring-[#652fe7]' : '',
                      ].join(' ')}
                      style={{ backgroundColor: bg }}
                    >
                      <div className="h-full flex items-center justify-center">
                        <span
                          className="text-xs font-bold"
                          style={{
                            color: day.isFuture
                              ? '#abadae'
                              : day.notes.length > 0
                              ? 'rgba(255,255,255,0.9)'
                              : '#abadae',
                          }}
                        >
                          {day.day}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Focus legend */}
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {(Object.entries(FOCUS_COLORS) as [FocusTag, string][]).map(([tag, color]) => (
            <div key={tag} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                {tag.replace(/-/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
