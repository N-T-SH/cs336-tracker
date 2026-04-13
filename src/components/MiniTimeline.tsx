'use client';

import { SiteData, Note, FocusTag } from '@/lib/types';

const FOCUS_COLORS: Record<FocusTag, string> = {
  'lecture-notes': 'bg-blue-500',
  'review-assignment': 'bg-amber-500',
  'setup-environment': 'bg-slate-500',
  'code-prototype': 'bg-green-500',
  'study-prerequisite': 'bg-purple-500',
  'optimize-impl': 'bg-rose-500',
};

interface MiniTimelineProps {
  data: SiteData;
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
}

export default function MiniTimeline({ data, selectedNote, onNoteSelect }: MiniTimelineProps) {
  const { config, notes } = data;
  
  // Group notes by date
  const notesByDate = new Map<string, Note[]>();
  for (const note of notes) {
    const date = note.frontmatter.date;
    if (!notesByDate.has(date)) {
      notesByDate.set(date, []);
    }
    notesByDate.get(date)!.push(note);
  }
  
  // Generate day cells
  const totalCells = Math.ceil(config.total_days);
  const startDate = new Date(config.start_date);
  const today = new Date().toISOString().split('T')[0];
  
  const days = [];
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayNotes = notesByDate.get(dateStr) || [];
    const isToday = dateStr === today;
    const isFuture = dateStr > today;
    
    days.push({
      day: i + 1,
      date: dateStr,
      notes: dayNotes,
      isToday,
      isFuture,
    });
  }
  
  return (
    <div className="py-4 border-b border-slate-800 overflow-x-auto">
      <div className="flex gap-1 min-w-max px-4">
        {days.map((day) => {
          const primaryNote = day.notes[0];
          const isSelected = selectedNote && day.notes.some(n => n.slug === selectedNote.slug);
          
          return (
            <div
              key={day.date}
              className={`w-8 h-8 rounded cursor-pointer transition-all hover:scale-110 ${
                day.isFuture
                  ? 'border border-slate-700'
                  : day.notes.length > 0
                  ? FOCUS_COLORS[primaryNote?.frontmatter.focus || 'lecture-notes']
                  : 'bg-slate-800'
              } ${day.isToday ? 'ring-2 ring-white' : ''} ${
                isSelected ? 'ring-2 ring-blue-400 scale-110' : ''
              }`}
              onClick={() => {
                if (day.notes.length > 0) {
                  onNoteSelect(day.notes[0]);
                }
              }}
              title={day.notes.length > 0 ? day.notes[0].frontmatter.title : `Day ${day.day}`}
            />
          );
        })}
      </div>
    </div>
  );
}
