'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitCommentAction(formData: FormData) {
  const postId = formData.get('postId') as string;
  const authorName = (formData.get('authorName') as string || '').trim();
  const authorEmail = (formData.get('authorEmail') as string || '').trim();
  const content = (formData.get('content') as string || '').trim();

  if (!postId || !authorName || !content) {
    return { success: false, error: 'Name and message are required.' };
  }

  if (content.length > 2000) {
    return { success: false, error: 'Comment must be under 2000 characters.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author_name: authorName,
      author_email: authorEmail || null,
      content: content,
      status: 'pending',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      message: 'Thank you. Your comment has been submitted and is awaiting moderation.' 
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

export async function moderateCommentAction(commentId: string, status: 'approved' | 'rejected' | 'deleted') {
  try {
    const supabase = await createClient();
    
    if (status === 'deleted') {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabase.from('comments').update({ status }).eq('id', commentId);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath('/admin/comments');
    revalidatePath('/poems');
    revalidatePath('/stories');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
