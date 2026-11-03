'use client';

interface NahwuBadgeProps {
  nahwuText?: string | null;
  className?: string;
}

export default function NahwuBadge({ nahwuText, className = '' }: NahwuBadgeProps) {
  if (!nahwuText) return null;

  const text = nahwuText.toLowerCase();

  // Detect grammatical case (I'rab state)
  let label = 'I\'rab';
  let colorStyles = 'bg-stone-100 text-stone-700 border-stone-200';

  if (text.includes('marfu') || text.includes('rafa') || text.includes('dhammah')) {
    label = 'Marfu\' (الرفع)';
    colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
  } else if (text.includes('manshub') || text.includes('nashab') || text.includes('fathah')) {
    label = 'Manshub (النصب)';
    colorStyles = 'bg-amber-50 text-amber-900 border-amber-200/80';
  } else if (text.includes('majrur') || text.includes('jar') || text.includes('kasrah')) {
    label = 'Majrur (الجر)';
    colorStyles = 'bg-rose-50 text-rose-800 border-rose-200/80';
  } else if (text.includes('majzum') || text.includes('jazm') || text.includes('sukun')) {
    label = 'Majzum (الجزم)';
    colorStyles = 'bg-sky-50 text-sky-800 border-sky-200/80';
  } else if (text.includes('mabni')) {
    label = 'Mabni (المبني)';
    colorStyles = 'bg-slate-100 text-slate-700 border-slate-300';
  }

  // Detect primary grammatical role if available
  let role = '';
  if (text.includes('mubtada')) role = 'Mubtada\'';
  else if (text.includes('khabar')) role = 'Khabar';
  else if (text.includes('fa\'il') || text.includes('fail')) role = 'Fa\'il';
  else if (text.includes('maf\'ul') || text.includes('maful')) role = 'Maf\'ul';
  else if (text.includes('mudhaf ilaih')) role = 'Mudhaf Ilaih';
  else if (text.includes('mudhaf')) role = 'Mudhaf';
  else if (text.includes('na\'at') || text.includes('sifat')) role = 'Na\'at / Sifat';
  else if (text.includes('huruf jar') || text.includes('harf jar')) role = 'Huruf Jar';
  else if (text.includes('hal') || text.includes('haal')) role = 'Haal';
  else if (text.includes('tamyiz')) role = 'Tamyiz';
  else if (text.includes('taukid')) role = 'Taukid';
  else if (text.includes('at展望') || text.includes('athaf')) role = 'Athaf';
  else if (text.includes('fi\'il') || text.includes('fiil')) role = 'Fi\'il';
  else if (text.includes('adat') || text.includes('huruf')) role = 'Huruf/Adat';

  return (
    <div className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
      {role && (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-forest/10 text-forest border border-forest/20">
          {role}
        </span>
      )}
      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colorStyles}`}>
        {label}
      </span>
    </div>
  );
}
