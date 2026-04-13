'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { SiteData, Note, FocusTag } from '@/lib/types';
import FocusPill from './FocusPill';

const FOCUS_THUMB_BG: Record<FocusTag, string> = {
  'lecture-notes':      '#dbeafe',
  'review-assignment':  '#fef3c7',
  'setup-environment':  '#f1f5f9',
  'code-prototype':     '#dcfce7',
  'study-prerequisite': '#f3e8ff',
  'optimize-impl':      '#ffe4e6',
};

const FOCUS_THUMB_ICON: Record<FocusTag, string> = {
  'lecture-notes':      '📖',
  'review-assignment':  '📝',
  'setup-environment':  '⚙️',
  'code-prototype':     '💻',
  'study-prerequisite': '🔬',
  'optimize-impl':      '⚡',
};

function getExcerpt(content: string, maxLen = 220): string {
  const stripped = content
    .replace(/^#+\s+.+$/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.+?)\]\(.*?\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^[-*>]\s+/gm, '')
    .replace(/\n+/g, ' ')
    .trim();
  return stripped.length > maxLen ? stripped.slice(0, maxLen) + '…' : stripped;
}

interface NoteViewerProps {
  data: SiteData;
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onBack: () => void;
}

export default function NoteViewer({ data, selectedNote, onNoteSelect, onBack }: NoteViewerProps) {
  const { notes } = data;

  const currentIndex = selectedNote
    ? notes.findIndex(n => n.slug === selectedNote.slug)
    : -1;
  const prevNote = currentIndex > 0 ? notes[currentIndex - 1] : null;
  const nextNote = currentIndex < notes.length - 1 ? notes[currentIndex + 1] : null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const mdComponents = {
    a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a {...props} className="underline transition-colors" style={{ color: '#652fe7' }}
        target="_blank" rel="noopener noreferrer" />
    ),
    code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
      const isInline = !className;
      return isInline ? (
        <code {...props} className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{ backgroundColor: '#f1f5f9', color: '#b60051' }}>
          {children}
        </code>
      ) : (
        <pre className="rounded-lg p-4 overflow-x-auto my-4"
          style={{ backgroundColor: '#0c0f10', borderLeft: '4px solid #b60051' }}>
          <code {...props} className={`${className ?? ''} text-sm font-mono`}
            style={{ color: '#e2e8f0' }}>
            {children}
          </code>
        </pre>
      );
    },
    blockquote: ({ ...props }: React.HTMLAttributes<HTMLElement>) => (
      <blockquote {...props} className="pl-4 italic my-4 py-2 pr-4 rounded-r"
        style={{ borderLeft: '4px solid #652fe7', backgroundColor: '#f5f6f7', color: '#595c5d' }} />
    ),
    h1: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props} className="text-3xl font-black mt-8 mb-4"
        style={{ color: '#2c2f30', letterSpacing: '-0.02em' }} />
    ),
    h2: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 {...props} className="text-2xl font-black mt-6 mb-3"
        style={{ color: '#2c2f30', letterSpacing: '-0.02em' }} />
    ),
    h3: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 {...props} className="text-xl font-bold mt-5 mb-2" style={{ color: '#2c2f30' }} />
    ),
    ul: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul {...props} className="list-disc list-inside my-4 ml-4 space-y-1" style={{ color: '#595c5d' }} />
    ),
    ol: ({ ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol {...props} className="list-decimal list-inside my-4 ml-4 space-y-1" style={{ color: '#595c5d' }} />
    ),
    li: ({ ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li {...props} className="my-1" />
    ),
    p: ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props} className="my-4 leading-relaxed text-[0.9375rem]" style={{ color: '#595c5d' }} />
    ),
    table: ({ ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto my-4">
        <table {...props} className="w-full border-collapse" />
      </div>
    ),
    thead: ({ ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead {...props} style={{ backgroundColor: '#f5f6f7' }} />
    ),
    th: ({ ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
      <th {...props} className="px-4 py-2 text-left text-sm font-semibold"
        style={{ border: '1px solid #dadddf', color: '#2c2f30' }} />
    ),
    td: ({ ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
      <td {...props} className="px-4 py-2 text-sm"
        style={{ border: '1px solid #dadddf', color: '#595c5d' }} />
    ),
  };

  return (
    <section style={{ borderTop: '1px solid #e6e8ea' }} id="note-viewer">
      {/* ── Note feed (always visible when no note selected) ── */}
      {!selectedNote && (
        <div className="max-w-[700px] mx-auto px-6 pt-6 pb-8" id="notes">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            All Notes
          </span>

          <div className="mt-6 space-y-8">
            {notes.length === 0 ? (
              <p className="text-[#595c5d] text-sm">No notes yet. Push your first markdown file to get started.</p>
            ) : (
              [...notes].reverse().map(note => (
                <article
                  key={note.slug}
                  className="bg-white rounded-xl card-aberration border overflow-hidden hover:shadow-md transition-all cursor-pointer"
                  style={{ borderColor: '#f1f5f9' }}
                  onClick={() => onNoteSelect(note)}
                >
                  <div className="flex min-h-[280px]">
                    {/* Left 2/3 — content */}
                    <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Day {note.frontmatter.day}
                          </span>
                          <FocusPill focus={note.frontmatter.focus} />
                        </div>
                        <h2
                          className="text-xl font-black text-[#2c2f30] mb-3"
                          style={{ letterSpacing: '-0.01em' }}
                        >
                          {note.frontmatter.title}
                        </h2>
                        <p className="text-[#595c5d] text-sm leading-relaxed line-clamp-6">
                          {getExcerpt(note.content, 360)}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {note.frontmatter.cs336_topic}
                        </span>
                        <span style={{ color: '#abadae' }}>·</span>
                        <span className="text-[10px] text-slate-400">
                          {note.frontmatter.duration_hours}h
                        </span>
                      </div>
                    </div>

                    {/* Right 1/3 — cover image or focus icon */}
                    <div className="w-1/3 shrink-0 overflow-hidden">
                      {note.frontmatter.cover_image ? (
                        <img
                          src={note.frontmatter.cover_image}
                          alt={note.frontmatter.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-5xl select-none"
                          style={{ backgroundColor: FOCUS_THUMB_BG[note.frontmatter.focus] }}
                          aria-hidden="true"
                        >
                          {FOCUS_THUMB_ICON[note.frontmatter.focus]}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Full note reader (shown when a note is selected) ── */}
      {selectedNote && (
        <>
          <div className="max-w-[700px] mx-auto px-6 py-8">
            {/* Back button */}
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm mb-8 transition-colors"
              style={{ color: '#595c5d' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#2c2f30')}
              onMouseLeave={e => (e.currentTarget.style.color = '#595c5d')}
            >
              <span>←</span>
              <span className="font-medium">All notes</span>
            </button>

            {/* Note header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <FocusPill focus={selectedNote.frontmatter.focus} />
                <span className="text-sm" style={{ color: '#595c5d' }}>
                  {formatDate(selectedNote.frontmatter.date)}
                </span>
                <span style={{ color: '#abadae' }}>·</span>
                <span className="text-sm" style={{ color: '#595c5d' }}>
                  {selectedNote.frontmatter.duration_hours}h
                </span>
              </div>

              <h1
                className="text-3xl md:text-4xl font-black leading-tight"
                style={{ color: '#2c2f30', letterSpacing: '-0.02em' }}
              >
                {selectedNote.frontmatter.title}
              </h1>

              {selectedNote.frontmatter.cs336_topic && (
                <p className="mt-2 text-sm" style={{ color: '#595c5d' }}>
                  {selectedNote.frontmatter.cs336_topic}
                </p>
              )}
            </div>

            {/* Markdown body */}
            <article>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={mdComponents}
              >
                {selectedNote.content}
              </ReactMarkdown>
            </article>

            {/* Prev / Next */}
            <div
              className="mt-12 pt-8 flex justify-between"
              style={{ borderTop: '1px solid #e6e8ea' }}
            >
              {prevNote ? (
                <button
                  onClick={() => onNoteSelect(prevNote)}
                  className="flex items-center gap-2 text-sm transition-colors"
                  style={{ color: '#595c5d' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#2c2f30')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#595c5d')}
                >
                  <span>←</span>
                  <span className="font-medium">{prevNote.frontmatter.title}</span>
                </button>
              ) : <div />}

              {nextNote ? (
                <button
                  onClick={() => onNoteSelect(nextNote)}
                  className="flex items-center gap-2 text-sm transition-colors"
                  style={{ color: '#595c5d' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#2c2f30')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#595c5d')}
                >
                  <span className="font-medium">{nextNote.frontmatter.title}</span>
                  <span>→</span>
                </button>
              ) : <div />}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
