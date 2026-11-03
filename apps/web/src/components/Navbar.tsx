'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-borderlight bg-canvas/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif italic text-xl text-ink font-semibold tracking-tight group-hover:text-cedar transition">
            Nahwu
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">
            Studio
          </span>
        </Link>

        {/* Clean Minimal Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/library"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              pathname === '/library'
                ? 'bg-ink text-surface'
                : 'text-ink-secondary hover:text-ink hover:bg-subtle'
            }`}
          >
            Arsip Kajian
          </Link>

          <Link
            href="/new"
            className="px-3.5 py-1.5 rounded-full bg-cedar hover:bg-cedar-hover text-surface text-xs font-medium transition flex items-center gap-1 shadow-minimal active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Kajian Baru</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
