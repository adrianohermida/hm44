import React from 'react';
import MediaOutletCard from '@/components/media/MediaOutletCard';
import { MEDIA_OUTLETS } from '@/components/constants/mediaData';

export default function MediaOutletsGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {MEDIA_OUTLETS.map((outlet, i) => (
        <MediaOutletCard key={i} {...outlet} />
      ))}
    </div>
  );
}