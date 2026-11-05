import React from 'react';

export default function WatermarkFooter() {
  return (
    <footer className="w-full py-6 text-center select-none pointer-events-auto">
      <p className="text-[11px] font-mono tracking-wider text-ink-muted/60 transition-colors hover:text-ink-secondary">
        project by <span className="font-semibold text-ink-secondary/80">Hamdipyxis</span>
      </p>
    </footer>
  );
}
