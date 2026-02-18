import React from 'react';
import { Play, Lock, CheckCircle2 } from 'lucide-react';

export default function VideoEpisodeCard({ episode, isLocked, isCompleted, isActive, onClick }) {
  return (
    <button
      onClick={!isLocked ? onClick : undefined}
      disabled={isLocked}
      className={`relative group w-full cursor-pointer disabled:cursor-not-allowed transition-all ${
        isActive ? 'ring-2 ring-[var(--brand-primary)]' : ''
      }`}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-[var(--bg-tertiary)]">
        <img 
          src={`https://img.youtube.com/vi/${episode.videoId}/maxresdefault.jpg`}
          alt={episode.title}
          className={`w-full h-full object-cover transition-all ${
            isLocked ? 'opacity-40 grayscale' : 'group-hover:scale-105'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          {isLocked && <Lock className="w-8 h-8 text-white" />}
          {!isLocked && !isCompleted && <Play className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />}
          {isCompleted && <CheckCircle2 className="w-12 h-12 text-[var(--brand-success)]" />}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[var(--brand-primary)] text-white text-xs px-2 py-1 rounded font-bold">
              EP {episode.number}
            </span>
            {isCompleted && <CheckCircle2 className="w-4 h-4 text-[var(--brand-success)]" />}
          </div>
          <p className="text-white text-sm font-semibold line-clamp-2">{episode.title}</p>
        </div>
      </div>
    </button>
  );
}