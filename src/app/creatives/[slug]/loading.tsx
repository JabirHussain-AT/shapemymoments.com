export default function CreativeProfileLoading() {
  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <div className="container-page max-w-5xl space-y-6">
        {/* Cover Skeleton */}
        <div className="h-48 sm:h-72 w-full rounded-3xl bg-muted/60 animate-pulse relative overflow-hidden" />

        {/* Profile Header Skeleton */}
        <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-muted animate-pulse shrink-0" />
              <div className="space-y-2">
                <div className="h-6 w-40 bg-muted animate-pulse rounded-lg" />
                <div className="h-4 w-28 bg-muted animate-pulse rounded-md" />
              </div>
            </div>
            <div className="h-10 w-36 bg-emerald-500/20 animate-pulse rounded-2xl" />
          </div>
        </div>

        {/* Content Tabs Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-40 rounded-3xl bg-card border border-border p-6 animate-pulse" />
            <div className="h-64 rounded-3xl bg-card border border-border p-6 animate-pulse" />
          </div>
          <div className="h-80 rounded-3xl bg-card border border-border p-6 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
