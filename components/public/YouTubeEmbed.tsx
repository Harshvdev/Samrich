'use client';

import { useState } from 'react';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string | null;
  autoplayOnClick?: boolean;
}

export function YouTubeEmbed({ videoId, title, autoplayOnClick = true }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) return null;

  const embedUrl = getYouTubeEmbedUrl(videoId) + (autoplayOnClick && isPlaying ? '&autoplay=1' : '');

  return (
    <div className="my-8 rounded-lg overflow-hidden border border-[var(--paper-border)] bg-[var(--paper-card)] shadow-xs">
      {isPlaying ? (
        <div className="relative w-full aspect-video">
          <iframe
            src={embedUrl}
            title={title || 'Poetry Reading Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      ) : (
        <div
          onClick={() => setIsPlaying(true)}
          className="group relative w-full aspect-video cursor-pointer overflow-hidden bg-black/5 flex items-center justify-center"
        >
          {/* Thumbnail image */}
          <img
            src={getYouTubeThumbnail(videoId)}
            alt={title || 'Watch poetry reading'}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />

          {/* Tactile play trigger */}
          <div className="relative z-10 w-14 h-14 rounded-full bg-[var(--paper-card)]/90 text-[var(--paper-ink)] shadow-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--paper-accent)] group-hover:text-white transition-all duration-300">
            <Play className="w-6 h-6 ml-0.5 fill-current" />
          </div>

          {title && (
            <div className="absolute bottom-3 left-4 right-4 z-10 text-white text-sm font-sans tracking-wide truncate drop-shadow-md">
              {title}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
