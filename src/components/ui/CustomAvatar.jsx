import React, { useState, useEffect } from "react";

export function CustomAvatar({ src, alt, fallback, className, fallbackClassName }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  if (src && !imageError) {
    return (
      <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
        <img
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full items-center justify-center ${className} ${fallbackClassName}`}>
      <span className="text-sm font-medium leading-none">{fallback}</span>
    </div>
  );
}