'use client';

import { useTransition } from 'react';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { moderateCommentAction } from '@/actions/comments';

export function CommentActionButtons({
  commentId,
  status,
}: {
  commentId: string;
  status: 'pending' | 'approved' | 'rejected';
}) {
  const [isPending, startTransition] = useTransition();

  if (status === 'pending') {
    return (
      <div className="flex items-center space-x-3 text-xs font-sans">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await moderateCommentAction(commentId, 'rejected');
            });
          }}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md border border-[var(--paper-border)] hover:border-red-400 text-[var(--paper-ink-muted)] hover:text-red-600 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Reject</span>
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await moderateCommentAction(commentId, 'approved');
            });
          }}
          className="inline-flex items-center space-x-1 px-4 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium shadow-xs disabled:opacity-40 cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approve & Publish</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm('Delete this comment permanently?')) {
          startTransition(async () => {
            await moderateCommentAction(commentId, 'deleted');
          });
        }
      }}
      className="p-1.5 text-[var(--paper-ink-muted)] hover:text-red-600 disabled:opacity-40 transition-colors cursor-pointer"
      title="Delete comment"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
