export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24 animate-pulse space-y-10">
      {/* Header skeleton */}
      <div className="space-y-4 max-w-xl">
        <div className="h-4 w-28 bg-[var(--paper-border)] rounded-sm" />
        <div className="h-10 w-3/4 bg-[var(--paper-border)] rounded-md" />
        <div className="h-4 w-full bg-[var(--paper-border)]/60 rounded-sm" />
      </div>

      {/* Cards/Stanzas skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[var(--paper-border)]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)]/40 space-y-4"
          >
            <div className="h-3 w-20 bg-[var(--paper-border)]/70 rounded-xs" />
            <div className="h-6 w-5/6 bg-[var(--paper-border)] rounded-sm" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-[var(--paper-border)]/50 rounded-xs" />
              <div className="h-3 w-4/5 bg-[var(--paper-border)]/50 rounded-xs" />
            </div>
            <div className="pt-4 flex justify-between">
              <div className="h-3 w-16 bg-[var(--paper-border)]/60 rounded-xs" />
              <div className="h-3 w-12 bg-[var(--paper-border)]/60 rounded-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
