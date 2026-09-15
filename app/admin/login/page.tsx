'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full p-8 rounded-2xl border border-[var(--paper-border)] bg-[var(--paper-card)] shadow-xs">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[var(--paper-muted)] text-[var(--paper-ink)] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-[var(--paper-ink)]">
            Samrich Studio
          </h1>
          <p className="text-xs uppercase tracking-widest text-[var(--paper-ink-muted)] mt-1 font-sans">
            Author Access
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-sans">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-sans text-sm">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="author@samrich.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--paper-ink)] focus:outline-hidden focus:border-[var(--paper-accent)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--paper-ink)] focus:outline-hidden focus:border-[var(--paper-accent)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-3 rounded-lg bg-[var(--paper-ink)] text-[var(--paper-bg)] hover:bg-[var(--paper-accent)] transition-colors font-sans text-xs uppercase tracking-wider font-medium disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Studio'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[var(--paper-border)] text-center text-xs font-sans text-[var(--paper-ink-muted)]">
          <Link href="/" className="hover:text-[var(--paper-ink)] transition-colors">
            &larr; Return to public reading site
          </Link>
        </div>
      </div>
    </div>
  );
}
