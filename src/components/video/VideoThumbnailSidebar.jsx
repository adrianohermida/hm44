import React from 'react';
import VideoEpisodeCard from './VideoEpisodeCard';

export default function VideoThumbnailSidebar({ episodes, currentEpisode, completedEpisodes, onSelectEpisode }) {
  return (
    <div className="hidden lg:block w-80 space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[var(--brand-primary)] scrollbar-track-[var(--bg-tertiary)]">
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
  );
}