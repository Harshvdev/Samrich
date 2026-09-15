'use client';

import { useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/auth';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await logoutAction();
        });
      }}
      className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-[var(--paper-ink-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-xs font-sans disabled:opacity-50 cursor-pointer"
      title="Sign out of Author Studio"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
    </button>
  );
}
