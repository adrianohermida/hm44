import React from 'react';
import { useYouTubeShorts } from '@/components/hooks/useYouTubeShorts';
import ShortPreviewCard from './ShortPreviewCard';

export default function YouTubeShortsPreview() {
  const { data: shorts, isLoading } = useYouTubeShorts();

  if (isLoading || !shorts || shorts.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {shorts.slice(0, 4).map((short) => (
        <ShortPreviewCard key={short.id} short={short} />
      ))}
    </div>
  );
}