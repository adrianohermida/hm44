import React from 'react';
import OptimizedImage from '@/components/common/OptimizedImage';

export default function AuthorityImage({ src, alt }) {
  return (
    <div className="order-2 lg:order-1">
      <OptimizedImage
        src={src}
        alt={alt}
        className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
        priority={false}
      />
    </div>
  );
}