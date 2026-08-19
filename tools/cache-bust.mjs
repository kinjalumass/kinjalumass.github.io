#!/usr/bin/env node
/**
 * Give the resume PDFs a content-based version, so replacing one actually
 * reaches people who have already visited.
 *
 * The problem
 * -----------
 * Angular fingerprints its own JS and CSS (`main-IJWYTANU.js`), so a new build
 * gets a new filename and no browser can serve a stale copy. Files in
 * `public/` are copied through untouched, which is what you want for
 * `robots.txt` and `CNAME` but not for a document that changes.
 *
 * `resume/kinjal-pandey-ai-ml.pdf` keeps its name forever. A visitor who
 * opened the resume page last month has that URL cached, so when Kinjal swaps
 * in a new PDF they carry on seeing the old one until their cache expires.
 * This is not hypothetical: it is exactly what happened the first time the
 * placeholder was replaced, and only on the AI/ML tab, because that is the
 * default tab and therefore the only one that had ever been fetched.
 *
 * The fix
 * -------
 * Append `?v=<first 8 hex of sha256>` to every reference. The query string
 * changes whenever the file's bytes change and stays put when they do not, so
 * caching still works, it just cannot serve the wrong version.
 *
 * Usage
 * -----
 *   node tools/cache-bust.mjs dist/portfolio/browser
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.argv[2];
if (!root) {
  console.error('Usage: node tools/cache-bust.mjs <dist folder>');
  process.exit(2);
}

/** Documents that keep a stable filename but whose contents change. */
const WATCHED = /^resume\/[A-Za-z0-9._-]+\.pdf$/;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const all = await walk(root);

// Build path -> version for everything we care about.
const versions = new Map();
for (const file of all) {
  const rel = relative(root, file).replace(/\\/g, '/');
  if (WATCHED.test(rel)) {
    versions.set(rel, createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 8));
  }
}

if (!versions.size) {
  console.log('  cache-bust   nothing to version');
  process.exit(0);
}

let edits = 0;
const editable = all.filter((f) => /\.(html|js)$/.test(f));

for (const file of editable) {
  const before = readFileSync(file, 'utf8');
  let after = before;

  for (const [rel, v] of versions) {
    // Match the path only when it is not already versioned, and only inside a
    // quoted string, so we never touch a substring of some longer identifier.
    const re = new RegExp(`(["'\`])${rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\?v=)\\1`, 'g');
    after = after.replace(re, (_, q) => `${q}${rel}?v=${v}${q}`);
  }

  if (after !== before) {
    writeFileSync(file, after);
    edits++;
  }
}

console.log(`  cache-bust   ${versions.size} document(s) versioned across ${edits} file(s)`);
for (const [rel, v] of versions) console.log(`                 ${rel}?v=${v}`);
