import React, { useState } from 'react';

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  aspectRatio = 'auto'
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-[var(--brand-bg-tertiary)] animate-pulse" />
      )}
    </div>
  );
}