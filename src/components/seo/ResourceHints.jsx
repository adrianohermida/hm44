import React from 'react';
import { Helmet } from 'react-helmet';

export default function ResourceHints() {
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
      
      {/* Preload critical fonts */}
      <link 
        rel="preload" 
        href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" 
        as="font" 
        type="font/woff2" 
        crossOrigin="anonymous" 
      />
    </Helmet>
  );
}