import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = loadEnv('production', root, 'VITE_');

export const API_BASE = env.VITE_API_URL?.trim().replace(/\/+$/, '');

if (!API_BASE) {
  throw new Error('Set VITE_API_URL to the backend origin before running build scripts.');
}

const parsed = new URL(API_BASE);
if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== API_BASE) {
  throw new Error('VITE_API_URL must be an HTTP(S) origin without a path.');
}
