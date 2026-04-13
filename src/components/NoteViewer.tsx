'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { SiteData, Note, FocusTag } from '@/lib/types';
import MiniTimeline from './MiniTimeline';
import FocusPill from './FocusPill';

// Soft background tints for note-card thumbnails
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

/** Strip markdown to produce a plain-text excerpt. */
function getExcerpt(content: string, maxLen = 220): string {
  const stripped = content
    .replace(/^#+\s+.+$/gm, '')          // headings
    .replace(/!\[.*?\]\(.*?\)/g, '')      // images
    .replace(/\[(.+?)\]\(.*?\)/g, '$1')  // links
    .replace(/\*\*(.+?)\*\*/g, '$1')     // bold
    .replace(/\*(.+?)\*/g, '$1')         // italic
    .replace(/`(.+?)`/g, '$1')           // inline code
    .replace(/^[-*>]\s+/gm, '')          // list/blockquote markers
    .replace(/\n+/g, ' ')
    .trim();
  return stripped.length > maxLen ? stripped.slice(0, maxLen) + '…' : stripped;
}

interface NoteViewerProps {
  data: SiteData;
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
}

export default function NoteViewer({ data, selectedNote, onNoteSelect }: NoteViewerProps) {
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

  // Custom markdown component overrides — light-theme aware, code blocks stay dark
  const mdComponents = {
    a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        {...props}
        className="underline transition-colors"
        style={{ color: '#652fe7' }}
        target="_blank"
        rel="noopener noreferrer"
      />
    ),
    code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
      const isInline = !className;
      return isInline ? (
        <code
          {...props}
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{ backgroundColor: '#f1f5f9', color: '#b60051' }}
        >
          {children}
        </code>
      ) : (
        <pre
          className="rounded-lg p-4 overflow-x-auto my-4"
          style={{
            backgroundColor: '#0c0f10',
            borderLeft: '4px solid #b60051',
          }}
        >
          <code {...props} className={`${className ?? ''} text-sm font-mono`}
            style={{ color: '#e2e8f0' }}>
            {children}
          </code>
        </pre>
      );
    },
    blockquote: ({ ...props }: React.HTMLAttributes<HTMLElement>) => (
      <blockquote
        {...props}
        className="pl-4 italic my-4 py-2 pr-4 rounded-r"
        style={{
          borderLeft: '4px solid #652fe7',
          backgroundColor: '#f5f6f7',
          color: '#595c5d',
        }}
      />
    ),
    h1: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        {...props}
        className="text-3xl font-black mt-8 mb-4"
        style={{ color: '#2c2f30', letterSpacing: '-0.02em' }}
      />
    ),
    h2: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        {...props}
        className="text-2xl font-black mt-6 mb-3"
        style={{ color: '#2c2f30', letterSpacing: '-0.02em' }}
      />
    ),
    h3: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        {...props}
        className="text-xl font-bold mt-5 mb-2"
        style={{ color: '#2c2f30' }}
      />
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
      <th
        {...props}
        className="px-4 py-2 text-left text-sm font-semibold"
        style={{ borderColor: '#dadddf', borderWidth: 1, borderStyle: 'solid', color: '#2c2f30' }}
      />
    ),
    td: ({ ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
      <td
        {...props}
        className="px-4 py-2 text-sm"
        style={{ borderColor: '#dadddf', borderWidth: 1, borderStyle: 'solid', color: '#595c5d' }}
      />
    ),
  };

  return (
    <section style={{ borderTop: '1px solid #e6e8ea' }} id="note-viewer">
      {/* Mini-timeline scrubber */}
      <MiniTimeline data={data} selectedNote={selectedNote} onNoteSelect={onNoteSelect} />

      <div className="max-w-[700px] mx-auto px-6 py-8" id="notes">
        {!selectedNote ? (
          /* ── Note feed (no note selected) ── */
          <div className="space-y-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              All Notes
            </span>

            {[...notes].reverse().map(note => (
              <article
                key={note.slug}
                className="bg-white p-6 rounded-xl card-aberration border hover:shadow-md transition-all cursor-pointer"
                style={{ borderColor: '#f1f5f9' }}
                onClick={() => onNoteSelect(note)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Day {note.frontmatter.day}
                  </span>
                  <FocusPill focus={note.frontmatter.focus} />
                </div>

                <div className="flex gap-6">
                  <div className="flex-1">
                    <h2
                      className="text-xl font-black text-[#2c2f30] mb-2"
                      style={{ letterSpacing: '-0.01em' }}
                    >
                      {note.frontmatter.title}
                    </h2>
                    <p className="text-[#595c5d] text-sm leading-relaxed line-clamp-4">
                      {getExcerpt(note.content)}
                    </p>
                  </div>

                  {/* Thumbnail */}
                  <div
                    className="w-24 h-24 shrink-0 overflow-hidden rounded-lg flex items-center justify-center text-3xl select-none"
                    style={{ backgroundColor: FOCUS_THUMB_BG[note.frontmatter.focus] }}
                    aria-hidden="true"
                  >
                    {FOCUS_THUMB_ICON[note.frontmatter.focus]}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* ── Full note viewer ── */
          <div>
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

            {/* Prev / Next navigation */}
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
        )}
      </div>
    </section>
  );
}
