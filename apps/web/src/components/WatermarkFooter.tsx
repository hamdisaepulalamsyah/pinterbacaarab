import React from 'react';
import Link from 'next/link';

export default function WatermarkFooter() {
  return (
    <footer className="w-full py-6 text-center select-none pointer-events-auto">
      <div className="flex items-center justify-center gap-2 text-[11px] font-mono tracking-wider text-ink-muted/70 transition-colors">
        <span className="font-serif italic text-xs text-ink-secondary/90 font-medium">Nahwu Studio</span>
        <span>•</span>
        <span>
          project by <span className="font-semibold text-ink-secondary/90">Hamdipyxis</span>
        </span>
        <span>•</span>
        <Link
          href="/dashboard"
          className="text-ink-muted/50 hover:text-cedar transition-colors hover:underline"
          title="Pusat Kendali Pengembang"
        >
          admin
        </Link>
      </div>
    </footer>
  );
}
