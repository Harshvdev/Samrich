'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { slugify, calculateReadingTime } from '@/lib/utils';
import { extractYouTubeId } from '@/lib/youtube';

export async function savePostAction(data: {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content_html: string;
  content_json?: any;
  type: 'poem' | 'story';
  status: 'draft' | 'published';
  tagNames?: string[];
  youtubeUrls?: string[];
}) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    const title = data.title.trim();
    if (!title) {
      return { success: false, error: 'Title is required.' };
    }

    const slug = data.slug ? slugify(data.slug) : slugify(title);
    const readingTime = calculateReadingTime(data.content_html || '');
    const publishedAt = data.status === 'published' ? new Date().toISOString() : null;

    const payload: any = {
      title,
      slug,
      excerpt: data.excerpt?.trim() || null,
      content: data.content_json || { type: 'doc', content: [] },
      content_html: data.content_html || '',
      type: data.type,
      status: data.status,
      reading_time: readingTime,
      updated_at: new Date().toISOString(),
    };

    if (publishedAt && data.status === 'published') {
      payload.published_at = publishedAt;
    }

    if (userData?.user) {
      payload.created_by = userData.user.id;
    }

    let postId = data.id;

    if (postId) {
      const { error: updateErr } = await supabase
        .from('posts')
        .update(payload)
        .eq('id', postId);
      if (updateErr) return { success: false, error: updateErr.message };
    } else {
      const { data: newPost, error: insertErr } = await supabase
        .from('posts')
        .insert(payload)
        .select('id')
        .single();
      if (insertErr) return { success: false, error: insertErr.message };
      postId = newPost.id;
    }

    // Handle YouTube videos
    if (postId && data.youtubeUrls) {
      // Clear previous and re-insert
      await supabase.from('post_videos').delete().eq('post_id', postId);
      const validVideos = data.youtubeUrls
        .map(url => extractYouTubeId(url))
        .filter(Boolean) as string[];

      if (validVideos.length > 0) {
        await supabase.from('post_videos').insert(
          validVideos.map((videoId, index) => ({
            post_id: postId,
            youtube_video_id: videoId,
            sort_order: index
          }))
        );
      }
    }

    // Revalidate affected routes
    revalidatePath('/');
    revalidatePath('/poems');
    revalidatePath('/stories');
    revalidatePath(`/poems/${slug}`);
    revalidatePath(`/stories/${slug}`);
    revalidatePath('/admin/posts');

    return { success: true, postId, slug };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

export async function deletePostAction(postId: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/poems');
    revalidatePath('/stories');
    revalidatePath('/admin/posts');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
