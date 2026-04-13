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
    const date = note.frontmatter.date;
    if (!notesByDate.has(date)) {
      notesByDate.set(date, []);
    }
    notesByDate.get(date)!.push(note);
  }
  
  // Generate day cells for total_days
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
      week: Math.floor(i / 7) + 1
    });
  }
  
  // Group by week
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  
  return (
    <section className="py-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-white mb-6">Timeline</h2>
        
        <div className="space-y-6">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-medium">Week {weekIdx + 1}</span>
                {config.week_labels[String(weekIdx + 1)] && (
                  <span className="text-slate-600">— {config.week_labels[String(weekIdx + 1)]}</span>
                )}
              </div>
              
              <div className="flex gap-1">
                {week.map((day) => {
                  const primaryNote = day.notes[0];
                  const isSelected = selectedNote && day.notes.some(n => n.slug === selectedNote.slug);
                  
                  return (
                    <div
                      key={day.date}
                      className={`flex-1 h-16 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                        day.isFuture
                          ? 'border border-slate-800 bg-slate-900/30'
                          : day.notes.length > 0
                          ? FOCUS_COLORS[primaryNote?.frontmatter.focus || 'lecture-notes']
                          : 'bg-slate-800'
                      } ${day.isToday ? 'ring-2 ring-white' : ''} ${
                        isSelected ? 'ring-2 ring-blue-400' : ''
                      }`}
                      onClick={() => {
                        if (day.notes.length > 0) {
                          onNoteSelect(day.notes[0]);
                        }
                      }}
                      title={day.notes.length > 0 ? day.notes[0].frontmatter.title : `Day ${day.day} - No note`}
                    >
                      <div className="h-full flex items-center justify-center">
                        <span className={`text-xs font-medium ${
                          day.isFuture ? 'text-slate-600' : day.notes.length > 0 ? 'text-white/80' : 'text-slate-600'
                        }`}>
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
      </div>
    </section>
  );
}
