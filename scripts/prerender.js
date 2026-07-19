import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL  = process.env.SITE_URL  || 'https://www.kemalozyon.com';
const API_BASE  = process.env.API_BASE  || 'https://portfoliobackend-production-3611.up.railway.app';
const DIST_DIR  = join(__dirname, '..', 'dist');
const DEFAULT_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;
const FETCH_TIMEOUT_MS = 60_000;

const escAttr = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const stripMarkdown = (md = '') =>
  md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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

function buildHtml(template, { title, description, path, image = DEFAULT_IMAGE, type = 'website', bodyFallback = '' }) {
  const canonical = `${SITE_URL}${path}`;
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/,
    `<title>${escText(title)}</title>`);
  html = html.replace(/<meta name="description"[^>]*>/,
    `<meta name="description" content="${escAttr(description)}" />`);
  html = html.replace(/<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${escAttr(canonical)}" />`);

  html = html.replace(/<meta property="og:type"[^>]*>/,
    `<meta property="og:type" content="${escAttr(type)}" />`);
  html = html.replace(/<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${escAttr(title)}" />`);
  html = html.replace(/<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${escAttr(description)}" />`);
  html = html.replace(/<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${escAttr(canonical)}" />`);
  html = html.replace(/<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${escAttr(image)}" />`);

  html = html.replace(/<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${escAttr(title)}" />`);
  html = html.replace(/<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${escAttr(description)}" />`);
  html = html.replace(/<meta name="twitter:image"[^>]*>/,
    `<meta name="twitter:image" content="${escAttr(image)}" />`);

  if (bodyFallback) {
    html = html.replace(/<div id="root">[\s\S]*?<\/div>/,
      `<div id="root">${bodyFallback}</div>`);
  }

  return html;
}

function writeRoute(outRelativePath, html) {
  const outPath = join(DIST_DIR, outRelativePath);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  console.log(`[prerender] wrote ${outRelativePath}`);
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    console.error(`[prerender] dist directory not found at ${DIST_DIR} — run vite build first.`);
    process.exit(1);
  }

  const template = readFileSync(join(DIST_DIR, 'index.html'), 'utf8');

  const staticPages = [
    {
      out: 'blogs/index.html',
      title: 'Blog — Kemal Özyön',
      description: 'Writing by Kemal Özyön on backend engineering, APIs, AI-powered agentic systems, and software development.',
      path: '/blogs',
      bodyFallback: `<main><h1>Blog — Kemal Özyön</h1><p>Writing by Kemal Özyön on backend engineering, APIs, AI-powered agentic systems, and software development.</p><p><a href="/">Home</a> · <a href="/projects">Projects</a></p></main>`,
    },
    {
      out: 'projects/index.html',
      title: 'Projects — Kemal Özyön',
      description: 'Software projects by Kemal Özyön — backend systems, APIs, data-driven applications, and AI-powered tools.',
      path: '/projects',
      bodyFallback: `<main><h1>Projects — Kemal Özyön</h1><p>Software projects by Kemal Özyön — backend systems, APIs, data-driven applications, and AI-powered tools.</p><p><a href="/">Home</a> · <a href="/blogs">Blog</a></p></main>`,
    },
  ];

  for (const page of staticPages) writeRoute(page.out, buildHtml(template, page));

  const [projectsRes, blogsRes] = await Promise.allSettled([
    fetchJson('/api/projects'),
    fetchJson('/api/blogs'),
  ]);

  const projects = projectsRes.status === 'fulfilled' ? projectsRes.value : [];
  const blogs    = blogsRes.status    === 'fulfilled' ? blogsRes.value    : [];

  if (projectsRes.status === 'rejected') console.warn('[prerender] projects fetch failed:', projectsRes.reason?.message);
  if (blogsRes.status    === 'rejected') console.warn('[prerender] blogs fetch failed:',    blogsRes.reason?.message);

  for (const p of projects) {
    const title = `${p.title} — Kemal Özyön`;
    const description = (p.description || '').slice(0, 160);
    writeRoute(`projects/${p._id}/index.html`, buildHtml(template, {
      title,
      description,
      path: `/projects/${p._id}`,
      image: p.coverImageUrl || DEFAULT_IMAGE,
      type: 'article',
      bodyFallback: `<main><h1>${escText(p.title)}</h1><p>${escText(description)}</p><p><a href="/projects">All projects</a></p></main>`,
    }));
  }

  const publishedBlogs = blogs.filter(b => b.isPublished !== false);
  for (const b of publishedBlogs) {
    const title = `${b.title} — Kemal Özyön`;
    const description = stripMarkdown(b.markdownContent).slice(0, 160);
    writeRoute(`blogs/${b._id}/index.html`, buildHtml(template, {
      title,
      description,
      path: `/blogs/${b._id}`,
      image: b.coverImageURL || DEFAULT_IMAGE,
      type: 'article',
      bodyFallback: `<main><h1>${escText(b.title)}</h1><p>${escText(description)}</p><p><a href="/blogs">All posts</a></p></main>`,
    }));
  }

  console.log(`[prerender] done: ${staticPages.length} static + ${projects.length} projects + ${publishedBlogs.length} blogs`);
}

main().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
