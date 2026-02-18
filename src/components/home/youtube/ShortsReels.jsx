import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShortsReels({ shorts }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleShorts = shorts.slice(currentIndex, currentIndex + 3);

  const handleNext = () => {
    if (currentIndex + 3 < shorts.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative flex items-center justify-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="absolute left-0 z-10 bg-white/90 hover:bg-white shadow-lg disabled:opacity-30"
        aria-label="Ver shorts anteriores"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <div className="flex gap-4 px-12">
        {visibleShorts.map((short) => (
          <ReelCard key={short.id} short={short} />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        disabled={currentIndex + 3 >= shorts.length}
        className="absolute right-0 z-10 bg-white/90 hover:bg-white shadow-lg disabled:opacity-30"
        aria-label="Ver próximos shorts"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
}

function ReelCard({ short }) {
  const youtubeUrl = `https://www.youtube.com/shorts/${short.video_id}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${short.video_id}/maxresdefault.jpg`;

  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-[280px] aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
    >
      <img
        src={thumbnailUrl}
        alt={short.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white font-bold text-base mb-2 line-clamp-2">
          {short.title}
        </h3>
        <p className="text-white/80 text-sm">
          {short.view_count} visualizações
        </p>
      </div>
    </a>
  );
}