'use client';

import { SiteConfig } from '@/lib/types';

interface HeaderProps {
  config: SiteConfig;
}

export default function Header({ config }: HeaderProps) {
  return (
    <header className="w-full top-0 sticky z-50 bg-white shadow-sm">
      <nav className="flex justify-between items-center px-8 py-4 max-w-[1440px] mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-black tracking-tighter text-slate-900 title-chromatic select-none">
            {config.site_title}
          </span>
        </div>

        {/* Nav + actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8 items-center">
            <a
              href="#notes"
              className="text-sm font-bold border-b-2 transition-transform active:scale-95"
              style={{ color: '#652fe7', borderColor: '#652fe7' }}
            >
              Notes
            </a>
            <a
              href={config.cs336_course_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors active:scale-95"
            >
              Syllabus
            </a>
          </div>

          <a
            href={config.github_repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 text-white"
            style={{ backgroundColor: '#652fe7' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5819db')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#652fe7')}
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
