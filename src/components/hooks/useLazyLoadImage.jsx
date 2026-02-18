import { useEffect, useRef, useState } from 'react';

/**
 * Lazy load images com IntersectionObserver
 * Carrega só quando entra no viewport
 */
export function useLazyLoadImage(threshold = 0.1) {
  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return {
    ref,
    isVisible,
    isLoaded,
    onLoad: () => setIsLoaded(true),
  };
}

export default function LazyImage({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E',
}) {
  const { ref, isVisible, onLoad } = useLazyLoadImage();
  const [error, setError] = useState(false);

  return (
    <img
      ref={ref}
      src={isVisible ? src : placeholder}
      alt={alt}
      className={`${className} transition-opacity duration-300`}
      onLoad={onLoad}
      onError={() => setError(true)}
      loading="lazy"
      decoding="async"
    />
  );
}