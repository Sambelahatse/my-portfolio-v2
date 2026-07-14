import React from 'react';

/* Pulsing skeleton block */
const Sk: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-white/10 ${className}`} />
);

/* Sidebar skeleton bar row */
const SkBar: React.FC<{ label?: string }> = ({ label }) => (
  <div className="space-y-1">
    {label && <Sk className="h-2.5 w-2/3" />}
    <Sk className="h-1.5 w-full" />
  </div>
);

/* Right-column text block */
const SkText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-1.5">
    {Array.from({ length: lines }).map((_, i) => (
      <Sk key={i} className={`h-2.5 ${i === lines - 1 ? 'w-3/4' : 'w-full'} bg-gray-200`} />
    ))}
  </div>
);

/* Timeline entry skeleton */
const SkEntry = () => (
  <div className="relative pl-5">
    {/* dot */}
    <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[4.5px] top-1 animate-pulse" />
    <div className="flex justify-between mb-1 gap-2">
      <Sk className="h-3 w-2/5 bg-[#D08B2A]/30" />
      <Sk className="h-2.5 w-1/4 bg-gray-200" />
    </div>
    <Sk className="h-2.5 w-3/5 mb-1 bg-gray-300" />
    <SkText lines={4} />
  </div>
);

const CvSkeleton: React.FC = () => (
  <div className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl flex flex-row overflow-hidden">

    {/* ── LEFT sidebar ── */}
    <aside className="w-[32%] shrink-0 bg-[#1E2535] flex flex-col p-5 space-y-5">
      {/* Avatar */}
      <Sk className="w-full aspect-square rounded-md" />

      {/* Contact lines */}
      <div className="space-y-2.5">
        {['w-[55%]', 'w-[70%]', 'w-[60%]', 'w-[50%]'].map((cls, i) => (
          <Sk key={i} className={`h-2.5 ${cls}`} />
        ))}
      </div>

      {/* Section: Langues */}
      <div className="space-y-2">
        <Sk className="h-3 w-1/2" />
        <SkBar label="Français" />
        <SkBar label="Anglais" />
      </div>

      {/* Section: Réseaux */}
      <div className="space-y-2">
        <Sk className="h-3 w-2/3" />
        <Sk className="h-2.5 w-3/4" />
        <Sk className="h-2.5 w-3/4" />
      </div>

      {/* Section: Atouts */}
      <div className="space-y-2">
        <Sk className="h-3 w-1/2" />
        {['w-full', 'w-[92%]', 'w-[84%]', 'w-[76%]', 'w-[68%]', 'w-[60%]'].map((cls, i) => (
          <Sk key={i} className={`h-2.5 ${cls}`} />
        ))}
      </div>

      {/* Section: Compétences bars */}
      <div className="space-y-3">
        <Sk className="h-3 w-1/2" />
        {Array.from({ length: 8 }).map((_, i) => (
          <SkBar key={i} label="skill" />
        ))}
      </div>
    </aside>

    {/* ── RIGHT content ── */}
    <main className="flex-1 flex flex-col bg-white">
      {/* Peach header */}
      <div className="bg-[#FFEFE0] px-7 py-7 border-b-4 border-white space-y-2">
        <Sk className="h-5 w-1/2 bg-gray-400/30" />
        <Sk className="h-4 w-1/3 bg-[#D08B2A]/30" />
        <Sk className="h-2.5 w-3/4 bg-gray-400/20" />
        <Sk className="h-2.5 w-2/3 bg-gray-400/20" />
      </div>

      <div className="px-7 py-5 space-y-6">
        {/* Diplômes section */}
        <div className="space-y-3">
          <Sk className="h-4 w-1/3 bg-gray-300" />
          <div className="border-l-[1.5px] border-gray-200 ml-1.5 pl-5 space-y-4">
            <SkEntry />
            <SkEntry />
          </div>
        </div>

        {/* Expériences section */}
        <div className="space-y-3">
          <Sk className="h-4 w-1/2 bg-gray-300" />
          <div className="border-l-[1.5px] border-gray-200 ml-1.5 pl-5 space-y-4">
            <SkEntry />
            <SkEntry />
            <SkEntry />
            <SkEntry />
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default CvSkeleton;
