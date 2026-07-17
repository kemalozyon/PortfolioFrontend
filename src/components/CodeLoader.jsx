import { useEffect, useState } from 'react';

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const STATUS_MESSAGES = [
  'resolving dependencies',
  'fetching from registry',
  'unpacking modules',
  'linking artifacts',
  'almost there',
];

const CodeLoader = ({ label = 'data', compact = false }) => {
  const [frame, setFrame] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(7);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % SPINNER_FRAMES.length), 80);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setStepIndex(s => (s + 1) % STATUS_MESSAGES.length), 1100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 95) return p;
        const remaining = 95 - p;
        return Math.min(95, p + Math.max(0.4, remaining * 0.07));
      });
    }, 180);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setShowCursor(c => !c), 500);
    return () => clearInterval(id);
  }, []);

  const filled = Math.floor(progress / 5);
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);

  return (
    <div className={`mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-950 font-mono ${compact ? 'max-w-sm text-xs' : 'max-w-md text-sm'}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border-b border-slate-700/60">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-slate-400 truncate">~/portfolio — fetching {label}</span>
      </div>

      <div className={`text-slate-200 space-y-1.5 ${compact ? 'p-3' : 'p-4'}`}>
        <div>
          <span className="text-emerald-400">$</span>{' '}
          <span className="text-slate-300">npm install</span>{' '}
          <span className="text-yellow-300">@kemalozyon/{label}</span>
        </div>
        <div className="text-slate-400">
          <span className="text-emerald-400">{SPINNER_FRAMES[frame]}</span> {STATUS_MESSAGES[stepIndex]}
          <span className="text-slate-600">...</span>
        </div>
        <div className="text-emerald-400 tabular-nums">
          [{bar}] {Math.floor(progress)}%
        </div>
        <div className="flex items-center pt-1">
          <span className="text-emerald-400 mr-2">$</span>
          <span className={`inline-block w-2 h-4 bg-emerald-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>

      <div className={`border-t border-slate-700/60 bg-slate-900/60 text-slate-400 leading-relaxed ${compact ? 'px-3 py-2 text-[11px]' : 'px-4 py-3 text-xs'}`}>
        <p>
          <span className="text-slate-500">// </span>
          Sunucu ücretsiz bir planda çalıştığı için uykuya geçmiş olabilir; başlaması birkaç saniye sürebilir. Lütfen bekleyin.
        </p>
        <p className="mt-1">
          <span className="text-slate-500">// </span>
          The server runs on a free plan and may be asleep, so it can take a few seconds to start. Please hang tight.
        </p>
      </div>
    </div>
  );
};

export default CodeLoader;
