import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import VideoEpisodeCard from './VideoEpisodeCard';

export default function VideoCarouselMobile({ episodes, currentEpisode, completedEpisodes, onSelectEpisode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg px-4 py-3 mb-4"
      >
        <span className="font-semibold text-[var(--text-primary)]">Ver todos os episódios</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      {isOpen && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {episodes.map((ep, idx) => (
            <VideoEpisodeCard
              key={idx}
              episode={ep}
              isLocked={idx > 0 && !completedEpisodes.includes(idx - 1)}
              isCompleted={completedEpisodes.includes(idx)}
              isActive={idx === currentEpisode}
              onClick={() => onSelectEpisode(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}