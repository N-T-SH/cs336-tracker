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

interface MiniTimelineProps {
  data: SiteData;
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
}

export default function MiniTimeline({ data, selectedNote, onNoteSelect }: MiniTimelineProps) {
  const { config, notes } = data;

  const notesByDate = new Map<string, Note[]>();
  for (const note of notes) {
    const d = note.frontmatter.date;
    if (!notesByDate.has(d)) notesByDate.set(d, []);
    notesByDate.get(d)!.push(note);
  }

  const totalCells = Math.ceil(config.total_days);
  const startDate = new Date(config.start_date + 'T00:00:00');
  const today = new Date().toISOString().split('T')[0];

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
    };
  });

  return (
    <div
      className="py-3 overflow-x-auto bg-white"
      style={{ borderBottom: '1px solid #e6e8ea' }}
    >
      <div className="flex gap-1 min-w-max px-6">
        {days.map(day => {
          const primaryNote = day.notes[0];
          const isSelected =
            selectedNote != null && day.notes.some(n => n.slug === selectedNote.slug);

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
                  : `Day ${day.day}`
              }
              className={[
                'w-6 h-6 rounded transition-all',
                day.notes.length > 0
                  ? 'cursor-pointer hover:opacity-80 hover:scale-110'
                  : 'cursor-default',
                day.isFuture ? 'border border-[#dadddf]' : '',
                day.isToday ? 'ring-2 ring-[#2c2f30]' : '',
                isSelected ? 'ring-2 ring-[#652fe7] scale-110' : '',
              ].join(' ')}
              style={{ backgroundColor: bg }}
            />
          );
        })}
      </div>
    </div>
  );
}
