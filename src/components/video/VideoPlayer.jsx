import React, { useEffect, useRef } from 'react';

export default function VideoPlayer({ videoUrl, onComplete }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.event === 'ended') onComplete?.();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
      <iframe
        ref={iframeRef}
        src={`${videoUrl}?enablejsapi=1&rel=0&showinfo=0&modestbranding=1&fs=0&controls=1&iv_load_policy=3&disablekb=1`}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        allowFullScreen={false}
        sandbox="allow-scripts allow-same-origin"
        title="Video Player"
      />
    </div>
  );
}