import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Play, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function VideoGallery({ videos, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!videos?.length) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--text-secondary)]">Nenhum vídeo disponível no momento.</p>
      </div>
    );
  }

  const formatViews = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || '0';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
        >
          <a 
            href={video.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="overflow-hidden border-[var(--border-primary)] bg-[var(--bg-elevated)] hover:shadow-lg transition-all">
              <div className="relative aspect-[9/16] bg-black">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="bg-black/70 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatViews(video.views)}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 leading-snug">
                  {video.title}
                </h3>
              </div>
            </Card>
          </a>
        </motion.div>
      ))}
    </div>
  );
}