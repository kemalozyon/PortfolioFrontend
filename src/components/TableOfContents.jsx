import GithubSlugger from 'github-slugger';

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

const TableOfContents = ({ content }) => {
  const headings = extractHeadings(content);
  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block w-52 flex-shrink-0">
      <div className="sticky top-24">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3">On this page</p>
        <nav className="space-y-1 border-l border-gray-200 dark:border-slate-800">
          {headings.map((h, i) => (
            <a
              key={i}
              href={`#${h.id}`}
              className={`block text-sm text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-200 transition-colors py-0.5 border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-400 truncate ${
                h.level === 1 ? 'pl-3' : h.level === 2 ? 'pl-5' : 'pl-8'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default TableOfContents;
