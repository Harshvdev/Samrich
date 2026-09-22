export default function AdminLoading() {
  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto animate-pulse space-y-8">
      {/* Admin header skeleton */}
      <div className="flex justify-between items-center pb-6 border-b border-[var(--paper-border)]">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-[var(--paper-border)] rounded-md" />
          <div className="h-3.5 w-64 bg-[var(--paper-border)]/60 rounded-xs" />
        </div>
        <div className="h-9 w-28 bg-[var(--paper-border)]/70 rounded-lg" />
      </div>

      {/* Admin content / stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)]/50 space-y-3"
          >
            <div className="h-3 w-24 bg-[var(--paper-border)]/70 rounded-xs" />
            <div className="h-8 w-16 bg-[var(--paper-border)] rounded-sm" />
          </div>
        ))}
      </div>

      {/* Table / List skeleton */}
      <div className="rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)]/40 p-6 space-y-4">
        <div className="h-5 w-36 bg-[var(--paper-border)] rounded-sm" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 w-full bg-[var(--paper-border)]/30 rounded-lg flex items-center justify-between px-4"
            >
              <div className="h-4 w-1/3 bg-[var(--paper-border)]/60 rounded-xs" />
              <div className="h-4 w-20 bg-[var(--paper-border)]/60 rounded-xs" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
