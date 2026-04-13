'use client';

import { SiteConfig } from '@/lib/types';

interface HeaderProps {
  config: SiteConfig;
}

export default function Header({ config }: HeaderProps) {
  return (
    <header className="w-full top-0 sticky z-50 bg-white shadow-sm">
      <nav className="flex items-center px-8 py-4 max-w-[1440px] mx-auto">
        <span className="text-2xl font-black tracking-tighter text-slate-900 title-chromatic select-none">
          {config.site_title}
        </span>
      </nav>
    </header>
  );
}
