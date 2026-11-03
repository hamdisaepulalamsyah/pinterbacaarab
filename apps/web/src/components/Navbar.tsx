'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookMarked, Sparkles, Plus, Library, Scroll } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-sand bg-surface/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-gold-light font-arabic text-2xl font-bold shadow-card group-hover:scale-105 transition-transform border border-gold/40">
            <span>ن</span>
            {/* Islamic decorative diamond dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rotate-45 bg-gold border border-surface rounded-xs"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-lg text-forest tracking-tight block leading-tight">
                Nahwu Studio
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-gold/15 text-gold-dark border border-gold/30">
                Kajian
              </span>
            </div>
            <span className="text-xs text-ink-soft font-medium hidden sm:block">
              Pinter Baca Arab & I&apos;rab Shorof
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/library"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              pathname === '/library'
                ? 'bg-forest/10 text-forest'
                : 'text-ink-muted hover:text-forest hover:bg-sand/40'
            }`}
          >
            <Library className="w-4 h-4 text-forest" />
            <span className="hidden sm:inline">Koleksi Kajian</span>
            <span className="sm:hidden">Koleksi</span>
          </Link>

          <Link
            href="/new"
            className="px-3.5 py-2 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-card border border-gold/30 active:scale-95"
          >
            <Plus className="w-4 h-4 text-gold-light" />
            <span>Kajian Baru</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
