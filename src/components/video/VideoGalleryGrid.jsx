import React from "react";
import VideoGalleryCard from "./VideoGalleryCard";

export default function VideoGalleryGrid({ videos }) {
  if (!videos.length) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">Nenhum vídeo disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoGalleryCard key={video.id} video={video} />
      ))}
    </div>
  );
}