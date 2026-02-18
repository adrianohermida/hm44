import React from 'react';
import { Play } from 'lucide-react';

export default function PodcastSection() {
  const episodes = [
    { title: 'Ep. 1: Como renegociar dívidas', duration: '25 min' },
    { title: 'Ep. 2: Seus direitos como consumidor', duration: '30 min' },
    { title: 'Ep. 3: Planejamento financeiro', duration: '22 min' }
  ];

  return (
    <section className="py-20 bg-[var(--brand-bg-secondary)]">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[var(--brand-text-primary)] mb-4">Podcast Jurídico</h2>
        <p className="text-center text-[var(--brand-text-secondary)] mb-12">Ouça nossos episódios sobre direito do consumidor</p>
        <div className="space-y-4">
          {episodes.map((ep, i) => (
            <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              <button className="w-12 h-12 bg-[var(--brand-primary)] rounded-full flex items-center justify-center hover:bg-[var(--brand-primary-600)]">
                <Play className="w-5 h-5 text-white ml-0.5" />
              </button>
              <div className="flex-1">
                <h3 className="font-bold text-[var(--brand-text-primary)]">{ep.title}</h3>
                <p className="text-sm text-[var(--brand-text-secondary)]">{ep.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}