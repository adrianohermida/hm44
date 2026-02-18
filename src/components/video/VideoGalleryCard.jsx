import React from "react";
import { Card } from "@/components/ui/card";
import { Play, Eye, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoGalleryCard({ video }) {
  const videoUrl = `https://www.youtube.com/watch?v=${video.video_id}`;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden bg-[var(--bg-elevated)] border-[var(--border-primary)] hover:shadow-xl transition-shadow">
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative aspect-video bg-gray-900">
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Play className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-[var(--text-primary)] line-clamp-2">
              {video.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              {video.view_count && (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {video.view_count}
                </span>
              )}
              {video.like_count && (
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {video.like_count}
                </span>
              )}
            </div>
          </div>
        </a>
      </Card>
    </motion.div>
  );
}