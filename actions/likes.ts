'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleLikeAction(postId: string, visitorId: string) {
  if (!postId || !visitorId) {
    return { success: false, error: 'Invalid parameters' };
  }

  try {
    const supabase = await createClient();
    
    // Check if like exists
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('visitor_identifier', visitorId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('likes')
        .delete()
        .eq('id', existing.id);
      revalidatePath(`/poems`);
      revalidatePath(`/stories`);
      return { success: true, liked: false };
    } else {
      await supabase
        .from('likes')
        .insert({
          post_id: postId,
          visitor_identifier: visitorId
        });
      revalidatePath(`/poems`);
      revalidatePath(`/stories`);
      return { success: true, liked: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
