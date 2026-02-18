import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LazyVideo({ src, poster, className }) {
  const [isInView, setIsInView] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={videoRef} className={cn('relative', className)}>
      {!showVideo ? (
        <button
          onClick={() => setShowVideo(true)}
          className="relative w-full group cursor-pointer"
        >
          <img src={poster} alt="Video thumbnail" className="w-full" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
            <Play className="w-16 h-16 text-white" />
          </div>
        </button>
      ) : (
        isInView && (
          <video src={src} controls autoPlay className="w-full">
            <source src={src} type="video/mp4" />
          </video>
        )
      )}
    </div>
  );
}