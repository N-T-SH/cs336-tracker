import { FocusTag } from '@/lib/types';

const FOCUS_COLORS: Record<FocusTag, string> = {
  'lecture-notes': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'review-assignment': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'setup-environment': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'code-prototype': 'bg-green-500/20 text-green-400 border-green-500/30',
  'study-prerequisite': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'optimize-impl': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

const FOCUS_LABELS: Record<FocusTag, string> = {
  'lecture-notes': 'Lecture Notes',
  'review-assignment': 'Review / Assignment',
  'setup-environment': 'Setup & Environment',
  'code-prototype': 'Code Up Prototype',
  'study-prerequisite': 'Study Prerequisite',
  'optimize-impl': 'Optimize Implementation',
};

interface FocusPillProps {
  focus: FocusTag;
}

export default function FocusPill({ focus }: FocusPillProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${FOCUS_COLORS[focus] || FOCUS_COLORS['lecture-notes']}`}>
      {FOCUS_LABELS[focus] || focus}
    </span>
  );
}
