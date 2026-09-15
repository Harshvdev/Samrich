'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { savePostAction } from '@/actions/posts';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';
import { Feather, BookOpen, Save, Send, Eye, Video, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PostEditorFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content_html: string;
    content_json?: any;
    type: 'poem' | 'story';
    status: 'draft' | 'published';
    youtubeUrls?: string[];
  };
}

export function PostEditorForm({ initialData }: PostEditorFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [type, setType] = useState<'poem' | 'story'>(initialData?.type || 'poem');
  const [contentHtml, setContentHtml] = useState(initialData?.content_html || '');
  const [contentJson, setContentJson] = useState(initialData?.content_json || null);
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrls?.[0] || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const previewVideoId = extractYouTubeId(youtubeUrl);

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      setErrorMessage('Please enter a title for this piece.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const res = await savePostAction({
        id: initialData?.id,
        title,
        slug: slug || undefined,
        excerpt,
        content_html: contentHtml,
        content_json: contentJson,
        type,
        status,
        youtubeUrls: youtubeUrl.trim() ? [youtubeUrl.trim()] : [],
      });

      if (res.success) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Failed to save post.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl font-sans">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--paper-border)]">
        <div>
          <h1 className="font-serif text-3xl text-[var(--paper-ink)] font-normal">
            {initialData?.id ? 'Edit Piece' : 'New Piece'}
          </h1>
          <p className="text-xs text-[var(--paper-ink-muted)] mt-1 font-sans">
            Craft verse or narrative with stanza and prose preservation.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-sans">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('draft')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--paper-ink)] hover:bg-[var(--paper-muted)] transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('published')}
            className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-[var(--paper-accent)] text-white hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Meta Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)]/50">
        
        {/* Type Selector */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-2 font-medium">
            Form Type
          </label>
          <div className="flex rounded-lg border border-[var(--paper-border)] p-1 bg-[var(--paper-bg)]">
            <button
              type="button"
              onClick={() => setType('poem')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md text-xs transition-colors ${
                type === 'poem'
                  ? 'bg-[var(--paper-card)] text-[var(--paper-accent)] font-medium shadow-xs'
                  : 'text-[var(--paper-ink-muted)]'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Poem</span>
            </button>
            <button
              type="button"
              onClick={() => setType('story')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md text-xs transition-colors ${
                type === 'story'
                  ? 'bg-[var(--paper-card)] text-[var(--paper-accent)] font-medium shadow-xs'
                  : 'text-[var(--paper-ink-muted)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Story</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-2 font-medium">
            Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Orchard at Twilight"
            className="w-full px-3.5 py-2 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--paper-ink)] focus:outline-hidden focus:border-[var(--paper-accent)] text-sm font-serif text-lg"
          />
        </div>

        {/* Slug */}
        <div className="sm:col-span-1">
          <label className="block text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-2 font-medium">
            URL Slug (Optional)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="the-orchard-at-twilight"
            className="w-full px-3.5 py-2 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--paper-ink)] focus:outline-hidden focus:border-[var(--paper-accent)] text-xs font-mono"
          />
        </div>

        {/* Excerpt */}
        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-2 font-medium">
            Excerpt / Opening Verse
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A single line or hook to represent the piece..."
            className="w-full px-3.5 py-2 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--paper-ink)] focus:outline-hidden focus:border-[var(--paper-accent)] text-xs font-serif italic"
          />
        </div>
      </div>

      {/* YouTube Reading Video Integration */}
      <div className="p-6 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)]/50 space-y-4">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] font-medium">
          <Video className="w-4 h-4 text-[var(--paper-accent)]" />
          <span>Accompaniment Video / Reading (YouTube)</span>
        </div>
        
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
          className="w-full px-3.5 py-2 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--paper-ink)] focus:outline-hidden focus:border-[var(--paper-accent)] text-xs font-mono"
        />

        {previewVideoId && (
          <div className="flex items-center space-x-4 p-3 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)]">
            <img
              src={getYouTubeThumbnail(previewVideoId)}
              alt="Video preview"
              className="w-24 h-14 object-cover rounded-sm border border-[var(--paper-border)]"
            />
            <div className="text-xs">
              <span className="font-medium text-[var(--paper-ink)]">Valid YouTube ID:</span>
              <span className="ml-1 font-mono text-[var(--paper-accent)]">{previewVideoId}</span>
              <p className="text-[11px] text-[var(--paper-ink-muted)] mt-0.5">
                This video will appear directly in the reader's view on the post.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tiptap Literary Editor */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-2 font-medium">
          Manuscript Content *
        </label>
        <TiptapEditor
          content={contentHtml}
          type={type}
          onChange={(html, json) => {
            setContentHtml(html);
            setContentJson(json);
          }}
        />
      </div>
    </div>
  );
}
