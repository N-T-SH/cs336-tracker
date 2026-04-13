'use client';

import { SiteConfig } from '@/lib/types';

interface HeaderProps {
  config: SiteConfig;
}

export default function Header({ config }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">
              {config.site_title}
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href={config.github_repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={config.cs336_course_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              CS336 Course
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
