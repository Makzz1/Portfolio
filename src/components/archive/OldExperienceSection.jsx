import React from 'react';

export default function OldExperienceSection() {
  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
      
      {/* ISRO */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-64 experience-card" id="isro-log">
        <div className="md:col-span-8 brutal-border-light brutal-shadow-light p-2 bg-zinc-900 group overflow-hidden">
          <img alt="ISRO Research" className="w-full h-[60vh] object-cover grayscale hover:grayscale-0 transition-all duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1p80wSPmJwV9Z-QPPCDKY5WfJllrbF2NjUaxehsQoevh433P_dAeFXN-CRZW6HjC15nOs_TaQaHyQLTb9jDSmR-PdwlX9P8g7bl6SI3CdISVskDrzH_mcQbqdFZxC0DbxjHrhznSZSkqbuJqlTcpKpuzuXcVcqGr-M_9n4lRtpTOc93K0omRAlmLMEXWjfYAftG0BHYV_uBjYoXuLr1hpNZCM0OwZsFWgWxuYfydRTL8G73wnyVfAQpW59-LG_jfdr10SbMB3LIw" />
        </div>
        <div className="md:col-span-4 flex flex-col justify-center">
          <h3 className="font-code-md text-xs text-white/50 uppercase tracking-[0.3em] mb-4">[ROLE_01]</h3>
          <h2 className="font-headline-xl text-5xl mb-6 text-white">ISRO IPRC</h2>
          <h4 className="font-label-caps text-sm text-accent-green mb-8 uppercase tracking-widest">Research Intern / Jun 2024</h4>
          <p className="font-body-md text-lg text-white/70 leading-relaxed mb-8">
            Designed a Python-based log management tool using Pandas to parse and analyze 10GB+ of daily network logs, reducing diagnostic lookup time by 40% for propulsion control networks.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="font-code-md text-[10px] border border-white/20 px-3 py-1 rounded-full uppercase text-white">Python_3.11</span>
            <span className="font-code-md text-[10px] border border-white/20 px-3 py-1 rounded-full uppercase text-white">Pandas</span>
            <span className="font-code-md text-[10px] border border-white/20 px-3 py-1 rounded-full uppercase text-white">Log_Analysis</span>
          </div>
        </div>
      </div>

      {/* WoowLocal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 experience-card" id="woowlocal-log">
        <div className="md:col-span-8 md:order-2 brutal-border-light brutal-shadow-light p-2 bg-zinc-900 group overflow-hidden">
          <img alt="Mobile Architecture" className="w-full h-[60vh] object-cover grayscale hover:grayscale-0 transition-all duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6vWotIiNREDolvt8DV8eBiO8uczRDa4pLsMdL5_i5Le0KZqu9WdHiqTMBgIw-iQKMfpb6eyvfdzmUS-l7vgwwa9a68csp8VVVxuAnmdehQDtql88G0hYOhx1OXMWoFtpGCZxlKyUsvZkB4E5YMGHb9rG5aJl-Dk05EjojrvrGoTCrLIh8R776I7LlCtaA2U9yXxilWVQxaeVRQMdrw6lc4rHogCKC3JcX0cNI0AaIFLdXa-TcVpJqVqmCfR9XNXP-UQjOZr-RJNc" />
        </div>
        <div className="md:col-span-4 md:order-1 flex flex-col justify-center">
          <h3 className="font-code-md text-xs text-white/50 uppercase tracking-[0.3em] mb-4">[ROLE_02]</h3>
          <h2 className="font-headline-xl text-5xl mb-6 text-white">WoowLocal</h2>
          <h4 className="font-label-caps text-sm text-accent-green mb-8 uppercase tracking-widest">Flutter Developer / Past</h4>
          <p className="font-body-md text-lg text-white/70 leading-relaxed mb-8">
            Developed mobile features for the &quot;Adugalam&quot; turf booking application. Focused on industry-scale mobile architecture and operational performance optimization.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="font-code-md text-[10px] border border-white/20 px-3 py-1 rounded-full uppercase text-white">Flutter</span>
            <span className="font-code-md text-[10px] border border-white/20 px-3 py-1 rounded-full uppercase text-white">Dart</span>
            <span className="font-code-md text-[10px] border border-white/20 px-3 py-1 rounded-full uppercase text-white">Mobile_Arch</span>
          </div>
        </div>
      </div>

    </div>
  );
}
