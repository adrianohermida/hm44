import React from 'react';
import { Helmet } from 'react-helmet';

export default function PreloadCritical() {
  return (
    <Helmet>
      {/* Critical connections */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS prefetch for below-fold resources */}
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="https://www.youtube.com" />
      <link rel="dns-prefetch" href="https://instagram.com" />
      <link rel="dns-prefetch" href="https://scontent.cdninstagram.com" />
    </Helmet>
  );
}