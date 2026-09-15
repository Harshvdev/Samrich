'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deletePostAction } from '@/actions/posts';

export function DeletePostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm('Are you sure you want to delete this piece?')) {
          startTransition(async () => {
            await deletePostAction(postId);
          });
        }
      }}
      className="p-1.5 text-[var(--paper-ink-muted)] hover:text-red-600 disabled:opacity-40 transition-colors cursor-pointer"
      title="Delete piece"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
