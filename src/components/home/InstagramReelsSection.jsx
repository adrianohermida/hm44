import React from 'react';
import { Instagram } from 'lucide-react';
import ReelCardPremium from './instagram/ReelCardPremium';

export default function InstagramReelsSection() {
  const reels = [
    { 
      id: 1, 
      instagramUrl: 'https://www.instagram.com/reel/DN_BVE2CusJ/',
      thumbnail: null,
      title: 'Legislação sobre Superendividamento', 
      views: '2.8K' 
    },
    { 
      id: 2, 
      instagramUrl: 'https://www.instagram.com/reel/DN-40gyjvpD/',
      thumbnail: null,
      title: 'Como Sair do Superendividamento', 
      views: '2.3K' 
    },
    { 
      id: 3, 
      instagramUrl: 'https://www.instagram.com/reel/DN-DaAZFc3I/',
      thumbnail: null,
      title: 'Fase Conciliatória no Procon', 
      views: '1.9K' 
    },
    { 
      id: 4, 
      instagramUrl: 'https://www.instagram.com/reel/DOYYDYbASun/',
      thumbnail: null,
      title: 'Riscos dos Contratos e Crédito Consignado', 
      views: '4.1K' 
    }
  ];

  return (
    <section className="py-16 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full mb-4">
            <Instagram className="w-5 h-5" />
            <span className="font-semibold text-sm">@dr.adrianohermidamaia</span>
          </div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-3">
            Reels Jurídicos no Instagram
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Conteúdo rápido e direto sobre seus direitos financeiros
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reels.map((reel) => (
            <ReelCardPremium
              key={reel.id}
              instagramUrl={reel.instagramUrl}
              thumbnail={reel.thumbnail}
              title={reel.title}
              views={reel.views}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <a 
            href="https://instagram.com/dr.adrianohermidamaia" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            <Instagram className="w-5 h-5" />
            Seguir no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}