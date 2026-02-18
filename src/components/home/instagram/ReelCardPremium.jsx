import React, { useState } from 'react';
import { Instagram, Play, Loader2 } from 'lucide-react';

export default function ReelCardPremium({ instagramUrl, thumbnail, title, views }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600"
    >
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-secondary)]">
          <Loader2 className="w-8 h-8 text-[var(--brand-primary)] animate-spin" />
        </div>
      )}

      {thumbnail && !error ? (
        <img
          src={thumbnail}
          alt={title}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Instagram className="w-20 h-20 text-white/30" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
          <Play className="w-8 h-8 text-white fill-white ml-1" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-semibold text-sm mb-1 line-clamp-2">{title}</p>
        {views && (
          <div className="flex items-center gap-2 text-xs text-white/80">
            <Instagram className="w-3 h-3" />
            <span>{views} visualizações</span>
          </div>
        )}
      </div>

      <Instagram className="absolute top-3 right-3 w-6 h-6 text-white drop-shadow-lg" />
    </a>
  );
}