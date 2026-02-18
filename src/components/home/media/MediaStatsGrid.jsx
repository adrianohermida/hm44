import React from 'react';
import MediaStatCard from '@/components/media/MediaStatCard';
import { MEDIA_STATS } from '@/components/constants/mediaData';

export default function MediaStatsGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {MEDIA_STATS.map((stat, i) => (
        <MediaStatCard key={i} {...stat} />
      ))}
    </div>
  );
}