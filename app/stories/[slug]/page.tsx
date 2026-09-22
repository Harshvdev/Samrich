import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { LikeButton } from '@/components/public/LikeButton';
import { CommentSection } from '@/components/public/CommentSection';
import { YouTubeEmbed } from '@/components/public/YouTubeEmbed';
import { getPostBySlug, getApprovedComments, getLikesCount } from '@/lib/posts/queries';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Story Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt || `A short story by Samrich.`,
    openGraph: {
      title: `${post.title} | Samrich`,
      description: post.excerpt || `A short story by Samrich.`,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      authors: ['Samrich'],
    },
  };
}

export const revalidate = 60;

export default async function StoryReaderPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.type !== 'story') {
    notFound();
  }

  const [comments, likesCount] = await Promise.all([
    getApprovedComments(post.id),
    getLikesCount(post.id),
  ]);

  return (
    <>
      <Header />

      <main className="flex-1 py-16 sm:py-24 px-6">
        <article className="reader-container">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-10 flex items-center justify-between text-xs font-sans text-[var(--paper-ink-muted)]">
            <Link
              href="/stories"
              className="inline-flex items-center space-x-1.5 hover:text-[var(--paper-ink)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all stories</span>
            </Link>

            <span className="inline-flex items-center space-x-1 text-[var(--paper-accent)] font-medium uppercase tracking-wider text-[11px]">
              <BookOpen className="w-3 h-3" />
              <span>Story</span>
            </span>
          </div>

          {/* Story Header */}
          <header className="mb-14 text-center sm:text-left">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[var(--paper-ink)] leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-sans text-[var(--paper-ink-muted)]">
              <span>By Samrich</span>
              <span>•</span>
              <time dateTime={post.published_at || post.created_at}>
                {formatDate(post.published_at || post.created_at)}
              </time>
              {post.reading_time && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.reading_time}</span>
                  </span>
                </>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[var(--paper-muted)] text-[var(--paper-ink-muted)]"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* STORY PROSE BODY */}
          <div className="font-serif text-lg sm:text-xl text-[var(--paper-ink)]/90 leading-relaxed font-normal space-y-6 mb-16 py-4 story-dropcap">
            {post.content_html ? (
              <div 
                className="space-y-6 [&>p]:leading-[1.85] [&>p]:mb-6"
                dangerouslySetInnerHTML={{ __html: post.content_html }} 
              />
            ) : (
              <p className="italic text-[var(--paper-ink-muted)]">No story prose recorded.</p>
            )}
          </div>

          {/* OPTIONAL YOUTUBE EMBED */}
          {(() => {
            const videoList = post.videos || (post as any).post_videos || [];
            if (videoList.length > 0 && videoList[0]?.youtube_video_id) {
              return (
                <div className="my-12">
                  <span className="block text-xs uppercase tracking-widest text-[var(--paper-accent)] font-sans font-medium mb-2">
                    Author Reading & Narration
                  </span>
                  <YouTubeEmbed
                    videoId={videoList[0].youtube_video_id}
                    title={videoList[0].title || post.title}
                  />
                </div>
              );
            }
            return null;
          })()}

          {/* INTERACTION BAR (LIKE) */}
          <div className="py-6 border-y border-[var(--paper-border)] flex items-center justify-between">
            <span className="font-serif italic text-sm text-[var(--paper-ink-muted)]">
              Did this story resonate with you?
            </span>
            <LikeButton postId={post.id} initialCount={likesCount} />
          </div>

          {/* MODERATED COMMENTS */}
          <CommentSection postId={post.id} comments={comments} />
        </article>
      </main>

      <Footer />
    </>
  );
}
