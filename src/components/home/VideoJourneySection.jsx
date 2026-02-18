import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import VideoJourneyNetflix from '../video/VideoJourneyNetflix';

export default function VideoJourneySection({ onScrollToCalculator }) {
  const episodes = [
    { number: 1, title: "Como Funciona a Lei do Superendividamento", url: "https://www.youtube.com/embed/Q0PSv2Lc8Qk", videoId: "Q0PSv2Lc8Qk" },
    { number: 2, title: "Quem Tem Direito a Utilizar a Lei", url: "https://www.youtube.com/embed/d7dW08nWAcY", videoId: "d7dW08nWAcY" },
    { number: 3, title: "Como Renegociar Dívidas", url: "https://www.youtube.com/embed/xUbtNefpFs8", videoId: "xUbtNefpFs8" },
    { number: 4, title: "Como Funciona o Plano de Pagamento", url: "https://www.youtube.com/embed/GEtGj05jxTw", videoId: "GEtGj05jxTw" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[var(--navy-950)] to-[var(--navy-900)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <GraduationCap className="w-4 h-4" />
            Jornada Educacional
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Sua Jornada para a Liberdade Financeira
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Complete esta série de vídeos para entender completamente como sair das dívidas
          </p>
        </div>

        <VideoJourneyNetflix episodes={episodes} />
      </div>
    </section>
  );
}