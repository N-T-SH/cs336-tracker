import { FocusTag } from '@/lib/types';

// Kinetic Manuscript pill color pairings
const PILL_STYLES: Record<FocusTag, { bg: string; color: string }> = {
  'lecture-notes':      { bg: 'rgba(38,230,255,0.2)', color: '#004f59' },
  'review-assignment':  { bg: '#fef3c7',               color: '#92400e' },
  'setup-environment':  { bg: '#f1f5f9',               color: '#475569' },
  'code-prototype':     { bg: '#dcfce7',               color: '#166534' },
  'study-prerequisite': { bg: 'rgba(169,143,255,0.25)', color: '#280072' },
  'optimize-impl':      { bg: 'rgba(255,143,169,0.35)', color: '#66002b' },
};

const FOCUS_LABELS: Record<FocusTag, string> = {
  'lecture-notes':      'Lecture Notes',
  'review-assignment':  'Review / Assignment',
  'setup-environment':  'Setup & Environment',
  'code-prototype':     'Code Prototype',
  'study-prerequisite': 'Study Prereq',
  'optimize-impl':      'Optimize Impl',
};

interface FocusPillProps {
  focus: FocusTag;
}

export default function FocusPill({ focus }: FocusPillProps) {
  const style = PILL_STYLES[focus] ?? PILL_STYLES['lecture-notes'];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-transform hover:scale-105"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {FOCUS_LABELS[focus] ?? focus}
    </span>
  );
}
