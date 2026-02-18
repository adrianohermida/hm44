import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function ShortPreviewCard({ short }) {
  const videoUrl = `https://www.youtube.com/shorts/${short.video_id}`;

  return (
    <motion.a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      className="relative group overflow-hidden rounded-xl aspect-[9/16] bg-[var(--bg-secondary)]"
    >
      <img
        src={short.thumbnail_url}
        alt={short.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-xs font-semibold line-clamp-2">{short.title}</p>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-[var(--brand-primary)] transition-colors">
          <Play className="w-6 h-6 text-[var(--brand-primary)] group-hover:text-white fill-current" />
        </div>
      </div>
    </motion.a>
  );
}