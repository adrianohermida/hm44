import React, { useState } from 'react';
import { Play, Eye, ThumbsUp } from 'lucide-react';
import ShortPlayerModal from './ShortPlayerModal';

export default function ShortCard({ short }) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <div 
        className="relative flex-shrink-0 w-[280px] sm:w-[320px] cursor-pointer group"
        onClick={() => setShowPlayer(true)}
      >
        <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg">
          <img
            src={short.thumbnail_url}
            alt={short.titulo}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 text-black ml-1" fill="black" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">
              {short.titulo}
            </h3>
            <div className="flex items-center gap-3 text-white/90 text-xs">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{(short.view_count / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                <span>{(short.like_count / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPlayer && (
        <ShortPlayerModal 
          videoId={short.video_id}
          titulo={short.titulo}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </>
  );
}