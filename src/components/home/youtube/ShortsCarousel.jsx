import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShortCard from './ShortCard';

export default function ShortsCarousel({ shorts }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    
    const scrollAmount = container.offsetWidth * 0.8;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.offsetWidth, scrollPosition + scrollAmount);
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  const showLeftArrow = scrollPosition > 0;
  const showRightArrow = scrollRef.current && scrollPosition < scrollRef.current.scrollWidth - scrollRef.current.offsetWidth - 10;

  return (
    <div className="relative group">
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}

      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-none scroll-smooth"
        onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
      >
        {shorts.map((short) => (
          <ShortCard key={short.id} short={short} />
        ))}
      </div>

      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Próximo"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}