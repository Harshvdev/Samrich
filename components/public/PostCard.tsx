import Link from 'next/link';
import { Post } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Feather, BookOpen, Clock, Heart } from 'lucide-react';

interface PostCardProps {
  post: Post;
  showType?: boolean;
}

export function PostCard({ post, showType = true }: PostCardProps) {
  const isPoem = post.type === 'poem';
  const href = isPoem ? `/poems/${post.slug}` : `/stories/${post.slug}`;

  return (
    <article className="group relative p-6 sm:p-8 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)]/40 hover:bg-[var(--paper-card)] hover:border-[var(--paper-ink-muted)]/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Type & Meta Header */}
        <div className="flex items-center justify-between text-xs text-[var(--paper-ink-muted)] mb-3 font-sans">
          <div className="flex items-center space-x-2">
            {showType && (
              <span className="inline-flex items-center space-x-1 uppercase tracking-widest text-[11px] font-medium text-[var(--paper-accent)]">
                {isPoem ? (
                  <>
                    <Feather className="w-3 h-3" />
                    <span>Poem</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3 h-3" />
                    <span>Story</span>
                  </>
                )}
              </span>
            )}
            {showType && <span>•</span>}
            <span>{formatDate(post.published_at || post.created_at)}</span>
          </div>

          {post.reading_time && (
            <span className="flex items-center space-x-1 text-[11px]">
              <Clock className="w-3 h-3" />
              <span>{post.reading_time}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[var(--paper-ink)] group-hover:text-[var(--paper-accent)] transition-colors mb-3 leading-snug">
          <Link href={href} className="focus:outline-hidden">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="font-serif text-[var(--paper-ink-muted)] text-sm sm:text-base leading-relaxed line-clamp-3 mb-6 italic">
            &ldquo;{post.excerpt}&rdquo;
          </p>
        )}
      </div>

      {/* Footer Tags & Link */}
      <div className="pt-4 border-t border-[var(--paper-border)]/60 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[var(--paper-muted)] text-[var(--paper-ink-muted)]"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <Link
          href={href}
          className="font-sans text-xs font-medium text-[var(--paper-ink)] group-hover:text-[var(--paper-accent)] transition-colors flex items-center space-x-1"
        >
          <span>Read</span>
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}
