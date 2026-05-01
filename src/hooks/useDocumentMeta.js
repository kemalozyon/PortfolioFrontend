import { useEffect } from 'react';

const SITE_URL = 'https://www.kemalozyon.com';
const DEFAULT_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

function upsertMeta(attr, name, content) {
  if (content == null) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useDocumentMeta({ title, description, path, image, type = 'website' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — Kemal Ozyon` : 'Kemal Ozyon — Backend-Focused Software Developer & AI Enthusiast';
    const canonical = path ? `${SITE_URL}${path}` : SITE_URL + '/';
    const ogImage = image || DEFAULT_IMAGE;

    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', ogImage);

    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);
  }, [title, description, path, image, type]);
}
