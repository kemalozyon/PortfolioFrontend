const Bar = ({ className = '' }) => <div className={`skeleton rounded bg-slate-800/70 ${className}`} />;

const LoadingSkeleton = ({ variant = 'projects', compact = false }) => {
  const detail = variant === 'project' || variant === 'blog';
  const cards = variant === 'projects';
  const label = detail ? (variant === 'project' ? 'project' : 'blog post') : variant;

  return (
    <div role="status" aria-live="polite" aria-label={`Loading ${label}`}>
      <p className="mb-5 flex items-center gap-2 font-mono text-xs text-slate-400">
        <span className="skeleton h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
        Fetching {label}…
      </p>
      <div aria-hidden="true">
        {detail ? (
          <div className="space-y-6">
            <Bar className="h-5 w-36" />
            {variant === 'project' && <Bar className="h-80 w-full rounded-2xl" />}
            <Bar className="h-12 w-3/4" />
            <div className="flex gap-2"><Bar className="h-7 w-20" /><Bar className="h-7 w-24" /><Bar className="h-7 w-16" /></div>
            <Bar className="h-5 w-full" /><Bar className="h-5 w-5/6" /><Bar className="h-5 w-2/3" />
            <div className="space-y-3 pt-6"><Bar className="h-8 w-48" />{[0, 1, 2, 3].map(i => <Bar key={i} className="h-4 w-full" />)}</div>
          </div>
        ) : (
          <div className={cards ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-4'}>
            {Array.from({ length: compact ? (cards ? 2 : 3) : (cards ? 4 : 3) }, (_, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
                {cards && <Bar className="h-52 w-full rounded-none" />}
                <div className={compact ? 'p-6 space-y-3' : 'p-8 space-y-4'}>
                  <Bar className="h-7 w-2/3" />
                  <Bar className="h-4 w-full" />
                  {cards && <><Bar className="h-4 w-5/6" />{!compact && <div className="flex gap-2 pt-2"><Bar className="h-6 w-20" /><Bar className="h-6 w-24" /></div>}</>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
