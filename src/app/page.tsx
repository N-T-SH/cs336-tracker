'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import Timeline from '@/components/Timeline';
import NoteViewer from '@/components/NoteViewer';
import { SiteData, Note } from '@/lib/types';
import siteData from '../../public/data.json';

export default function Home() {
  const data = siteData as SiteData;
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Default to today's note (or most recent if none today)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayNote = data.notes.find(n => n.frontmatter.date === today);
    if (todayNote) {
      setSelectedNote(todayNote);
    } else if (data.notes.length > 0) {
      setSelectedNote(data.notes[data.notes.length - 1]);
    }
  }, [data.notes]);

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    document.getElementById('note-viewer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f6f2' }}>
      <Header config={data.config} />

      <Dashboard data={data} onNoteSelect={handleNoteSelect} />

      <Timeline
        data={data}
        selectedNote={selectedNote}
        onNoteSelect={handleNoteSelect}
      />

      <NoteViewer
        data={data}
        selectedNote={selectedNote}
        onNoteSelect={handleNoteSelect}
      />

      {/* Footer */}
      <footer
        className="w-full py-10 mt-16"
        style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderTop: '1px solid #e6e8ea' }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-[1440px] mx-auto gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-black text-[#2c2f30] title-chromatic text-sm">
              {data.config.site_title}
            </span>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">
              Stanford CS336 · Language Modeling from Scratch
            </p>
          </div>
          <div className="flex gap-6">
            <a
              href={data.config.github_repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-[#b60051] transition-colors"
            >
              GitHub
            </a>
            <a
              href={data.config.cs336_course_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-[#b60051] transition-colors"
            >
              Course
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
