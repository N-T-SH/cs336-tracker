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
  
  // Set today's note as default on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayNote = data.notes.find(n => n.frontmatter.date === today);
    if (todayNote) {
      setSelectedNote(todayNote);
    } else if (data.notes.length > 0) {
      // Default to most recent note
      setSelectedNote(data.notes[data.notes.length - 1]);
    }
  }, [data.notes]);
  
  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    // Smooth scroll to note viewer
    document.getElementById('note-viewer')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <main className="min-h-screen bg-slate-950">
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
    </main>
  );
}
