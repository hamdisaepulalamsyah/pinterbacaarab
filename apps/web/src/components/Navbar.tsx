'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-borderlight/80 bg-canvas/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-1.5 group transition-transform duration-300 ease-fluid active:scale-95">
          <span className="font-serif italic text-xl sm:text-2xl text-ink font-semibold tracking-tight group-hover:text-cedar transition-colors duration-300">
            PinterBacaArab
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted group-hover:text-ochre transition-colors duration-300 px-1.5 py-0.5 rounded bg-subtle/80">
            Studio
          </span>
        </Link>

        {/* Clean Minimal Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/library"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-fluid active:scale-95 ${
              pathname === '/library'
                ? 'bg-ink text-surface shadow-minimal'
                : 'text-ink-secondary hover:text-ink hover:bg-subtle'
            }`}
          >
            Arsip Kajian
          </Link>

          <Link
            href="/new"
            className="px-3.5 py-1.5 rounded-full bg-cedar hover:bg-cedar-hover text-surface text-xs font-medium transition-all duration-300 ease-fluid flex items-center gap-1 shadow-minimal hover:shadow-glow active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
            <span>Kajian Baru</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
