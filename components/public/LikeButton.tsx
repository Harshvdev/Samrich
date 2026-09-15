'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleLikeAction } from '@/actions/likes';

interface LikeButtonProps {
  postId: string;
  initialCount?: number;
}

export function LikeButton({ postId, initialCount = 0 }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // Check if visitor has already liked this post in localStorage
    const likedPosts = JSON.parse(localStorage.getItem('samrich-liked-posts') || '[]');
    if (likedPosts.includes(postId)) {
      setHasLiked(true);
    }
  }, [postId]);

  const handleLike = async () => {
    if (isPending) return;

    // Retrieve or generate visitor ID
    let visitorId = localStorage.getItem('samrich-visitor-id');
    if (!visitorId) {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('samrich-visitor-id', visitorId);
    }

    const nextLikedState = !hasLiked;
    const nextCount = nextLikedState ? likes + 1 : Math.max(0, likes - 1);

    // Optimistic UI update
    setHasLiked(nextLikedState);
    setLikes(nextCount);
    setIsPending(true);

    // Update local storage
    const likedPosts = JSON.parse(localStorage.getItem('samrich-liked-posts') || '[]');
    if (nextLikedState) {
      if (!likedPosts.includes(postId)) likedPosts.push(postId);
    } else {
      const idx = likedPosts.indexOf(postId);
      if (idx > -1) likedPosts.splice(idx, 1);
    }
    localStorage.setItem('samrich-liked-posts', JSON.stringify(likedPosts));

    try {
      await toggleLikeAction(postId, visitorId);
    } catch {
      // Revert on error
      setHasLiked(!nextLikedState);
      setLikes(likes);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`group flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300 ${
        hasLiked
          ? 'border-[var(--paper-accent)] bg-[var(--paper-accent-soft)] text-[var(--paper-accent)]'
          : 'border-[var(--paper-border)] hover:border-[var(--paper-ink-muted)] text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)]'
      }`}
      aria-label={hasLiked ? 'Unlike this piece' : 'Like this piece'}
      title={hasLiked ? 'Appreciated' : 'Show appreciation'}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
          hasLiked ? 'fill-current' : ''
        }`}
      />
      <span className="text-xs font-sans font-medium tracking-wide">
        {likes}
      </span>
    </button>
  );
}
