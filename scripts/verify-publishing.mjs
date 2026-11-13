// Run only in a disposable copy: fixtures can never reach the deployment artifact.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { posts } from '../src/lib/content.js';

const root = process.cwd();
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-publishing-'));
const ignored = new Set(['node_modules', '.git', 'dist', 'public', '.astro']);
try {
  fs.cpSync(root, temporary, { recursive: true, filter: source =>
    !path.relative(root, source).split(path.sep).some(part => ignored.has(part)) });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temporary, 'node_modules'), 'dir');
  // Force an additional page, regardless of how much content is already published.
  const count = 10 - (posts.length % 10) + 1;
  const prefix = `publishing-fixture-${path.basename(temporary).toLowerCase()}`;
  for (let i = 0; i <= count; i++) {
    fs.writeFileSync(path.join(temporary, 'content/posts', `${prefix}-${i}.md`),
      `---\ntitle: Publishing fixture ${i}\ndate: 2099-01-01\ndraft: ${i === count}\n---\nTemporary publishing regression content ${i}.\n`);
  }
  const run = args => execFileSync('npm', args, { cwd: temporary, stdio: 'inherit',
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
  run(['run', 'build']);
  run(['test']);
  for (let i = 0; i < count; i++) {
    assert(fs.existsSync(path.join(temporary, 'dist/posts', `${prefix}-${i}/index.html`)));
  }
  assert(!fs.existsSync(path.join(temporary, 'dist/posts', `${prefix}-${count}/index.html`)), 'Draft fixture published');
  for (const file of ['index.xml', 'posts/index.xml', 'sitemap.xml', 'posts/index.html']) {
    const output = fs.readFileSync(path.join(temporary, 'dist', file), 'utf8');
    assert(!output.includes(`${prefix}-${count}`), `Draft leaked into ${file}`);
  }
  const historical = JSON.parse(fs.readFileSync(path.join(temporary, 'tests/historical-entries.json'), 'utf8'));
  fs.unlinkSync(path.join(temporary, historical[0].file));
  assert.throws(() => execFileSync(process.execPath, ['scripts/verify-build.mjs'], { cwd: temporary, stdio: 'pipe' }),
    error => error.stderr.toString().includes('Historical entry missing or moved'), 'Missing historical content must still fail');
  console.log(`PASS: ${count} new posts accepted, pagination boundary crossed, draft excluded; production content and dist untouched.`);
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
