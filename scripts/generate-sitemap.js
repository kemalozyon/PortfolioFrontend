import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = process.env.SITE_URL || 'https://www.kemalozyon.com';
const API_BASE = process.env.API_BASE || 'https://portfoliobackend-fp0u.onrender.com';
const FETCH_TIMEOUT_MS = 60_000;

const STATIC_ROUTES = [
  { path: '/',         changefreq: 'monthly', priority: 1.0 },
  { path: '/projects', changefreq: 'monthly', priority: 0.7 },
  { path: '/blogs',    changefreq: 'weekly',  priority: 0.7 },
];

async function fetchJson(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function isoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function urlEntry({ path, changefreq, priority, lastmod }) {
  const lines = [
    '  <url>',
    `    <loc>${SITE_URL}${path}</loc>`,
    lastmod    ? `    <lastmod>${lastmod}</lastmod>`             : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>`   : null,
    priority != null ? `    <priority>${priority.toFixed(1)}</priority>` : null,
    '  </url>',
  ].filter(Boolean);
  return lines.join('\n');
}

async function main() {
  const [projectsRes, blogsRes] = await Promise.allSettled([
    fetchJson('/api/projects'),
    fetchJson('/api/blogs'),
  ]);

  const projects = projectsRes.status === 'fulfilled' ? projectsRes.value : [];
  const blogs    = blogsRes.status    === 'fulfilled' ? blogsRes.value    : [];

  if (projectsRes.status === 'rejected') console.warn('[sitemap] projects fetch failed:', projectsRes.reason?.message);
  if (blogsRes.status    === 'rejected') console.warn('[sitemap] blogs fetch failed:',    blogsRes.reason?.message);

  const dynamicProjectEntries = projects.map(p => ({
    path: `/projects/${p._id}`,
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: isoDate(p.updatedAt || p.createdAt),
  }));

  const dynamicBlogEntries = blogs
    .filter(b => b.isPublished !== false)
    .map(b => ({
      path: `/blogs/${b._id}`,
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: isoDate(b.updatedAt || b.createdAt),
    }));

  const allEntries = [...STATIC_ROUTES, ...dynamicProjectEntries, ...dynamicBlogEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(urlEntry).join('\n')}
</urlset>
`;

  const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, xml, 'utf8');

  console.log(`[sitemap] wrote ${allEntries.length} URLs (${STATIC_ROUTES.length} static, ${dynamicProjectEntries.length} projects, ${dynamicBlogEntries.length} blogs) -> ${outPath}`);
}

main().catch(err => {
  console.error('[sitemap] generation failed:', err);
  process.exit(1);
});
