'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { SiteData, Note } from '@/lib/types';
import MiniTimeline from './MiniTimeline';
import FocusPill from './FocusPill';

interface NoteViewerProps {
  data: SiteData;
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
}

export default function NoteViewer({ data, selectedNote, onNoteSelect }: NoteViewerProps) {
  const { notes } = data;
  
  // Find previous and next notes
  const currentIndex = selectedNote ? notes.findIndex(n => n.slug === selectedNote.slug) : -1;
  const prevNote = currentIndex > 0 ? notes[currentIndex - 1] : null;
  const nextNote = currentIndex < notes.length - 1 ? notes[currentIndex + 1] : null;
  
  // Format date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Custom markdown components
  const components = {
    a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a {...props} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" />
    ),
    code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className;
      
      return isInline ? (
        <code {...props} className="bg-slate-800 text-rose-300 px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      ) : (
        <pre className="bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-x-auto my-4">
          <code {...props} className={`${className} text-sm font-mono`}>
            {children}
          </code>
        </pre>
      );
    },
    blockquote: ({ ...props }: React.HTMLAttributes<HTMLElement>) => (
      <blockquote {...props} className="border-l-4 border-blue-500 pl-4 italic text-slate-300 my-4" />
    ),
    h1: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props} className="text-3xl font-bold text-white mt-8 mb-4" />
    ),
    h2: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 {...props} className="text-2xl font-bold text-white mt-6 mb-3" />
    ),
    h3: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 {...props} className="text-xl font-semibold text-white mt-5 mb-2" />
    ),
    ul: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul {...props} className="list-disc list-inside text-slate-300 my-4 ml-4" />
    ),
    ol: ({ ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol {...props} className="list-decimal list-inside text-slate-300 my-4 ml-4" />
    ),
    li: ({ ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li {...props} className="my-1" />
    ),
    p: ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props} className="text-slate-300 my-4 leading-relaxed" />
    ),
    table: ({ ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <table {...props} className="w-full border-collapse my-4" />
    ),
    thead: ({ ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead {...props} className="bg-slate-800" />
    ),
    th: ({ ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
      <th {...props} className="border border-slate-700 px-4 py-2 text-left text-slate-300 font-semibold" />
    ),
    td: ({ ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
      <td {...props} className="border border-slate-700 px-4 py-2 text-slate-400" />
    ),
  };
  
  if (!selectedNote) {
    return (
      <section className="py-12 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MiniTimeline data={data} selectedNote={selectedNote} onNoteSelect={onNoteSelect} />
          <div className="mt-8 text-center text-slate-500">
            <p>Select a day from the timeline to view a note</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-8 border-t border-slate-800" id="note-viewer">
      <MiniTimeline data={data} selectedNote={selectedNote} onNoteSelect={onNoteSelect} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Note Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FocusPill focus={selectedNote.frontmatter.focus} />
            <span className="text-slate-500 text-sm">
              {formatDate(selectedNote.frontmatter.date)}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500 text-sm">
              {selectedNote.frontmatter.duration_hours} hours
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {selectedNote.frontmatter.title}
          </h1>
          <p className="text-slate-400 mt-2">
            {selectedNote.frontmatter.cs336_topic}
          </p>
        </div>
        
        {/* Note Content */}
        <article className="prose prose-invert max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={components}
          >
            {selectedNote.content}
          </ReactMarkdown>
        </article>
        
        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between">
          {prevNote ? (
            <button
              onClick={() => onNoteSelect(prevNote)}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Previous note</span>
            </button>
          ) : (
            <div />
          )}
          {nextNote ? (
            <button
              onClick={() => onNoteSelect(nextNote)}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>Next note</span>
              <span>→</span>
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}
