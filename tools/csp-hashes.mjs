#!/usr/bin/env node
/**
 * Add per-page CSP hashes for Angular's inline hydration scripts.
 *
 * The problem
 * -----------
 * Angular 22 emits two inline <script> blocks into every prerendered page for
 * event replay: the event-dispatch contract, and a bootstrap call listing the
 * events that page cares about. Event replay is on by default in this version
 * and there is no flag to turn it off.
 *
 * Our CSP is `script-src 'self'` with no 'unsafe-inline', so the browser
 * blocks both. Nothing fails at build time; the page just logs violations.
 *
 * The fix
 * -------
 * CSP lets you allow a specific inline script by its hash. That keeps the
 * policy strict: only these exact bytes may run, and any injected script still
 * cannot. So after each build we hash whatever Angular emitted and write the
 * hashes into that page's own CSP meta tag.
 *
 * Per page, not global: the bootstrap call differs from page to page, so a
 * shared list would be wrong everywhere except the page it came from.
 *
 * Usage
 * -----
 *   node tools/csp-hashes.mjs dist/portfolio/browser
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.argv[2];
if (!root) {
  console.error('Usage: node tools/csp-hashes.mjs <dist folder>');
  process.exit(2);
}

/** Script types the browser never executes, so no hash is needed. */
const INERT = new Set(['application/json', 'application/ld+json', 'importmap', 'speculationrules']);

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Every executable inline script on the page, exactly as the browser sees it. */
export function inlineScripts(html) {
  const found = [];
  for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [, attrs, body] = m;
    if (/\ssrc=/.test(attrs)) continue;
    const type = (attrs.match(/type="([^"]+)"/) ?? [, 'text/javascript'])[1];
    if (INERT.has(type)) continue;
    if (body.length) found.push(body);
  }
  return found;
}

export const sha256 = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;

let touched = 0;
let skipped = 0;

for (const file of await htmlFiles(root)) {
  let html = readFileSync(file, 'utf8');

  const csp = html.match(/(<meta http-equiv="Content-Security-Policy" content=")([\s\S]*?)(">)/);
  if (!csp) {
    skipped++;
    continue;
  }

  const hashes = [...new Set(inlineScripts(html).map(sha256))];
  if (!hashes.length) continue;

  // Drop any hashes from a previous run so repeat builds do not accumulate.
  let policy = csp[2].replace(/\s*'sha256-[A-Za-z0-9+/=]+'/g, '');

  const updated = policy.replace(
    /script-src([^;]*)/,
    (_, existing) => `script-src${existing} ${hashes.join(' ')}`,
  );
  if (updated === policy) {
    console.error(`  ${relative(root, file)}: no script-src directive to extend`);
    process.exitCode = 1;
    continue;
  }

  html = html.slice(0, csp.index) + csp[1] + updated + csp[3] + html.slice(csp.index + csp[0].length);
  writeFileSync(file, html);
  touched++;
}

console.log(`  CSP hashes   ${touched} pages updated${skipped ? `, ${skipped} without a CSP meta` : ''}`);
