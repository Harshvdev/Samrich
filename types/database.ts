export type PostType = 'poem' | 'story';
export type PostStatus = 'draft' | 'published';
export type CommentStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any; // Tiptap JSON
  content_html: string | null;
  type: PostType;
  status: PostStatus;
  cover_url: string | null;
  reading_time: string | null;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  videos?: PostVideo[];
  likes_count?: number;
  comments_count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  post_id: string;
  visitor_identifier: string;
  created_at: string;
}

export interface PostVideo {
  id: string;
  post_id: string;
  youtube_video_id: string;
  title: string | null;
  sort_order: number;
  created_at: string;
}
