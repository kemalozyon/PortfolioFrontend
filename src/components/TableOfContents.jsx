const toSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const extractHeadings = (markdown) => {
  const headings = [];
  for (const line of markdown.split('\n')) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const rawText = match[2]
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .trim();
      headings.push({ level: match[1].length, text: rawText, id: toSlug(rawText) });
    }
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
