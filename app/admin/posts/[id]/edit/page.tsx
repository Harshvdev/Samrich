import { createClient } from '@/lib/supabase/server';
import { PostEditorForm } from '@/components/admin/PostEditorForm';
import { notFound } from 'next/navigation';
import { getPublishedPosts } from '@/lib/posts/queries';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  let post: any = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('*, post_videos(*)')
      .eq('id', id)
      .single();
    if (data) post = data;
  } catch {
    // Check fallback
  }

  if (!post) {
    const fallbackList = await getPublishedPosts();
    post = fallbackList.find(p => p.id === id);
  }

  if (!post) {
    notFound();
  }

  const initialData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content_html: post.content_html || '',
    content_json: post.content,
    type: post.type,
    status: post.status,
    youtubeUrls: post.post_videos?.map((v: any) => v.youtube_video_id) || [],
  };

  return <PostEditorForm initialData={initialData} />;
}
