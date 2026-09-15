'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import { Bold, Italic, List, Heading2, Quote, Undo, Redo, Video, AlignLeft } from 'lucide-react';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string, json: any) => void;
  type: 'poem' | 'story';
}

export function TiptapEditor({ content, onChange, type }: TiptapEditorProps) {
  const isPoem = type === 'poem';

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: isPoem
          ? 'Write your poem lines here...\nUse Shift+Enter for line breaks within a stanza,\nor Enter to begin a new stanza.'
          : 'Write your story narrative here...',
      }),
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'aspect-video w-full rounded-lg my-6',
        },
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: `focus:outline-hidden min-h-[320px] font-serif text-lg leading-relaxed text-[var(--paper-ink)] ${
          isPoem ? 'poem-stanza-editor space-y-4' : 'space-y-4'
        }`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="p-8 border border-[var(--paper-border)] rounded-lg min-h-[320px] bg-[var(--paper-card)] flex items-center justify-center text-sm text-[var(--paper-ink-muted)]">
        Loading literary editor...
      </div>
    );
  }

  const addYouTubeVideo = () => {
    const url = prompt('Enter YouTube Video URL:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  return (
    <div className="border border-[var(--paper-border)] rounded-xl overflow-hidden bg-[var(--paper-card)] shadow-xs">
      {/* Editorial Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[var(--paper-border)] bg-[var(--paper-muted)]/40 text-[var(--paper-ink-muted)] font-sans text-xs">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-md hover:bg-[var(--paper-muted)] hover:text-[var(--paper-ink)] transition-colors ${
            editor.isActive('bold') ? 'bg-[var(--paper-muted)] text-[var(--paper-accent)] font-bold' : ''
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md hover:bg-[var(--paper-muted)] hover:text-[var(--paper-ink)] transition-colors ${
            editor.isActive('italic') ? 'bg-[var(--paper-muted)] text-[var(--paper-accent)] italic' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-md hover:bg-[var(--paper-muted)] hover:text-[var(--paper-ink)] transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[var(--paper-muted)] text-[var(--paper-accent)] font-semibold' : ''
          }`}
          title="Heading"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-md hover:bg-[var(--paper-muted)] hover:text-[var(--paper-ink)] transition-colors ${
            editor.isActive('blockquote') ? 'bg-[var(--paper-muted)] text-[var(--paper-accent)]' : ''
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md hover:bg-[var(--paper-muted)] hover:text-[var(--paper-ink)] transition-colors ${
            editor.isActive('bulletList') ? 'bg-[var(--paper-muted)] text-[var(--paper-accent)]' : ''
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-[var(--paper-border)] mx-1" />

        <button
          type="button"
          onClick={addYouTubeVideo}
          className="p-2 rounded-md hover:bg-[var(--paper-muted)] hover:text-[var(--paper-ink)] transition-colors"
          title="Embed YouTube Video"
        >
          <Video className="w-4 h-4" />
        </button>

        <div className="ml-auto flex items-center space-x-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-md hover:bg-[var(--paper-muted)] disabled:opacity-30 transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-md hover:bg-[var(--paper-muted)] disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-6 sm:p-8 min-h-[360px] bg-[var(--paper-card)] cursor-text">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Helper Note */}
      <div className="px-6 py-2.5 border-t border-[var(--paper-border)] bg-[var(--paper-muted)]/20 text-[11px] font-sans text-[var(--paper-ink-muted)] flex justify-between items-center">
        <span>
          {isPoem ? 'Poem Mode: Enter creates a new stanza break.' : 'Story Mode: Enter creates a paragraph.'}
        </span>
        <span>Tiptap ProseMirror Engine</span>
      </div>
    </div>
  );
}
