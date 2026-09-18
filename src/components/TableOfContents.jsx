import GithubSlugger from 'github-slugger';
import { useEffect, useMemo, useState } from 'react';

const extractHeadings = (markdown) => {
  const headings = [];
  const slugger = new GithubSlugger();
  let fence = null;
  for (const line of markdown.split('\n')) {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;
    const match = line.match(/^\s{0,3}(#{1,6})\s+(.+)$/);
    if (!match) continue;
    const rawText = match[2]
      .replace(/\s+#+\s*$/, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .trim();
    const id = slugger.slug(rawText);
    if (match[1].length <= 3) headings.push({ level: match[1].length, text: rawText, id });
  }
  return headings;
};

const TableOfContents = ({ content, mobile = false }) => {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState('');
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let frame;
    const update = () => {
      let current = headings[0]?.id || '';
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 140) current = heading.id;
      }
      setActiveId(current);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [headings]);
  if (headings.length === 0) return null;
  const active = headings.find((heading) => heading.id === activeId) || headings[0];
  const links = (
        <nav aria-label="On this page" className="space-y-1 border-l border-slate-800">
          {headings.map((h, i) => (
            <a
              key={i}
              href={`#${h.id}`}
              aria-current={h.id === active.id ? 'location' : undefined}
              onClick={(event) => {
                const element = document.getElementById(h.id);
                if (!element) return;
                event.preventDefault();
                setOpen(false);
                element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
                window.history.replaceState(window.history.state, '', `#${h.id}`);
              }}
              className={`block text-sm transition-colors py-1.5 pr-2 border-l-2 break-words hover:text-slate-200 ${h.id === active.id ? 'border-emerald-400 bg-emerald-400/5 text-emerald-300' : 'border-transparent text-slate-500'} ${
                h.level === 1 ? 'pl-3' : h.level === 2 ? 'pl-5' : 'pl-8'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
  );
  return (
    <>
    <aside className="hidden lg:block sticky top-24 self-start w-52 flex-shrink-0 max-h-[calc(100dvh-7rem)] overflow-y-auto">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">On this page</p>
      {links}
    </aside>
    {mobile && <aside className="fixed bottom-4 left-4 right-4 z-40 rounded-xl border border-slate-700 bg-slate-950/95 shadow-xl backdrop-blur lg:hidden">
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-page-contents" className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm">
        <span className="shrink-0 text-xs text-emerald-400">On this page</span>
        <span className="min-w-0 flex-1 truncate text-slate-300">{active.text}</span>
        <span aria-hidden="true">{open ? '▾' : '▴'}</span>
      </button>
      {open && <div id="mobile-page-contents" onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }} className="max-h-[50dvh] overflow-y-auto border-t border-slate-800 px-4 py-3">{links}</div>}
    </aside>}
    </>
  );
};

export default TableOfContents;
