'use client';

interface NahwuBadgeProps {
  nahwuText?: string | null;
  className?: string;
}

export default function NahwuBadge({ nahwuText, className = '' }: NahwuBadgeProps) {
  if (!nahwuText) return null;

  const text = nahwuText.toLowerCase();

  let label = 'I\'rab';
  let pillClass = 'text-stone-600 bg-stone-100/80';

  if (text.includes('marfu') || text.includes('rafa') || text.includes('dhammah')) {
    label = 'Marfu\'';
    pillClass = 'text-emerald-900 bg-emerald-50/90';
  } else if (text.includes('manshub') || text.includes('nashab') || text.includes('fathah')) {
    label = 'Manshub';
    pillClass = 'text-amber-900 bg-amber-50/90';
  } else if (text.includes('majrur') || text.includes('jar') || text.includes('kasrah')) {
    label = 'Majrur';
    pillClass = 'text-rose-900 bg-rose-50/90';
  } else if (text.includes('majzum') || text.includes('jazm') || text.includes('sukun')) {
    label = 'Majzum';
    pillClass = 'text-sky-900 bg-sky-50/90';
  } else if (text.includes('mabni')) {
    label = 'Mabni';
    pillClass = 'text-stone-700 bg-stone-100/90';
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-medium transition-all duration-200 ease-fluid hover:scale-105 select-none ${pillClass} ${className}`}
    >
      {label}
    </span>
  );
}
