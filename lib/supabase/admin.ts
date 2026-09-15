import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const secretKey = process.env.SUPABASE_SECRET_KEY || '';

  if (!supabaseUrl || !secretKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in environment');
  }

  return createSupabaseClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
