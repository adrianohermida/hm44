import React, { useState, useEffect, useRef } from 'react';

export default function LazyVideo({ src, title, className = '' }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        <iframe
          src={src}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-[var(--brand-bg-tertiary)] animate-pulse flex items-center justify-center">
          <span className="text-[var(--text-tertiary)]">Carregando vídeo...</span>
        </div>
      )}
    </div>
  );
}