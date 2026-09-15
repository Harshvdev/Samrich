-- ==============================================================================
-- Migration 001: Samrich Poems & Stories Initial Schema
-- ==============================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Author profile)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    display_name TEXT NOT NULL DEFAULT 'Samrich',
    slug TEXT NOT NULL UNIQUE DEFAULT 'samrich',
    bio TEXT DEFAULT '',
    avatar_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. POSTS (Poems & Stories)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content JSONB NOT NULL DEFAULT '{"type": "doc", "content": []}'::jsonb,
    content_html TEXT,
    type TEXT NOT NULL CHECK (type IN ('poem', 'story')),
    status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    cover_url TEXT,
    reading_time TEXT,
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TAGS
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. POST_TAGS (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.post_tags (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- 5. COMMENTS (Moderated reader comments)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. LIKES (Anonymous reader appreciation)
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    visitor_identifier TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(post_id, visitor_identifier)
);

-- 7. POST_VIDEOS (Associated YouTube video readings/performances)
CREATE TABLE IF NOT EXISTS public.post_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    youtube_video_id TEXT NOT NULL,
    title TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_posts_type_status ON public.posts(type, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_comments_post_status ON public.comments(post_id, status);
CREATE INDEX IF NOT EXISTS idx_post_tags_post ON public.post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON public.post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_likes_post ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_videos_post ON public.post_videos(post_id, sort_order ASC);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_videos ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Public can view author profiles"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Author can update own profile"
    ON public.profiles FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- POSTS
CREATE POLICY "Public can view published posts"
    ON public.posts FOR SELECT
    USING (status = 'published');

CREATE POLICY "Author has full access to all posts"
    ON public.posts FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- TAGS
CREATE POLICY "Public can view tags"
    ON public.tags FOR SELECT
    USING (true);

CREATE POLICY "Author can manage tags"
    ON public.tags FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- POST_TAGS
CREATE POLICY "Public can view post tags"
    ON public.post_tags FOR SELECT
    USING (true);

CREATE POLICY "Author can manage post tags"
    ON public.post_tags FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- COMMENTS
CREATE POLICY "Public can view approved comments"
    ON public.comments FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Anyone can submit a pending comment"
    ON public.comments FOR INSERT
    WITH CHECK (status = 'pending');

CREATE POLICY "Author can manage all comments"
    ON public.comments FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- LIKES
CREATE POLICY "Public can view likes"
    ON public.likes FOR SELECT
    USING (true);

CREATE POLICY "Public can add likes"
    ON public.likes FOR INSERT
    WITH CHECK (true);

-- POST_VIDEOS
CREATE POLICY "Public can view videos for published posts"
    ON public.post_videos FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.posts
            WHERE posts.id = post_videos.post_id
            AND posts.status = 'published'
        )
    );

CREATE POLICY "Author can manage post videos"
    ON public.post_videos FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- Table and Schema Grants for Supabase Roles
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
