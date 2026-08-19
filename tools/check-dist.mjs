#!/usr/bin/env node
/**
 * Check a built site against its own Content-Security-Policy.
 *
 * Why this exists
 * ---------------
 * The CSP lives in a <meta> tag, so nothing at build time knows about it and a
 * violation never fails the build. It fails silently in the browser instead,
 * and the page looks broken with no error anywhere in the terminal.
 *
 * That has already happened twice here:
 *
 *   1. Angular's `inlineCritical` rewrote the stylesheet link as
 *      <link media="print" onload="this.media='all'">. With script-src 'self'
 *      the onload never ran, so the global stylesheet never applied and every
 *      page rendered with component styles only. That is what produced white
 *      buttons and an unstyled Kinnovation hero.
 *
 *   2. Angular's event replay emitted two inline <script> blocks, both
 *      blocked, so replay did nothing but log violations.
 *
 * Usage
 * -----
 *   node tools/check-dist.mjs dist/portfolio/browser
 *
 * Exits non-zero on any finding, so CI stops before publishing.
 */

import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { inlineScripts, sha256 } from './csp-hashes.mjs';

const root = process.argv[2];
if (!root) {
  console.error('Usage: node tools/check-dist.mjs <dist folder>');
  process.exit(2);
}

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const findings = [];
const files = await htmlFiles(root);

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const where = relative(root, file);
  const csp = (html.match(/<meta http-equiv="Content-Security-Policy" content="([\s\S]*?)">/) ?? [, ''])[1];

  // 1. Inline event handlers. Blocked outright: hashes do not cover these
  //    without 'unsafe-hashes', which we do not want.
  for (const m of html.matchAll(/\s(on[a-z]+)="([^"]*)"/g)) {
    findings.push(`${where}: inline handler ${m[1]}="${m[2].slice(0, 50)}"`);
  }

  // 2. Every executable inline script must be covered by a hash in this
  //    page's own policy.
  for (const body of inlineScripts(html)) {
    const h = sha256(body);
    if (!csp.includes(h)) {
      findings.push(`${where}: inline <script> (${body.length} chars) has no CSP hash. Run tools/csp-hashes.mjs.`);
    }
  }

  // 3. A stylesheet parked on media="print" was never applied to the screen.
  for (const m of html.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)) {
    if (/media="print"/.test(m[0])) {
      findings.push(`${where}: stylesheet left at media="print" -> ${m[0].slice(0, 90)}`);
    }
  }
}

console.log(`Checked ${files.length} HTML files in ${root}`);
if (findings.length) {
  console.error(`\n${findings.length} CSP problem(s):\n`);
  for (const f of findings.slice(0, 25)) console.error('  ' + f);
  if (findings.length > 25) console.error(`  ... and ${findings.length - 25} more`);
  process.exit(1);
}
console.log('  No CSP violations. Every inline script is hash-allowed; nothing is silently blocked.');
