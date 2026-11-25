// stamp.mjs - version stamps for the C4 Live page, taken from the files themselves.
//   node Tools/c4-live/stamp.mjs           rewrite every ?v= stamp to the first 10 hex of the file's sha256
//   node Tools/c4-live/stamp.mjs --check   change nothing; exit 1 and list the stamps that are out of date
// Why: the site sends C4Live scripts and styles with a long cache life (see _headers at the repo root), so a visitor
// only gets a changed file when its ?v= stamp changes. A stamp typed by hand can be forgotten; a stamp that IS the
// content cannot. Run it last, after every build (scene-src/build.mjs, collect-src/build.mjs) and every edit.
// Order matters and is handled here: app.js names c4-scene.js and c4-collect.js, so it is stamped first and hashed
// after; index.html names app.js and the rest, so it is done last.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PAGE = path.join(ROOT, 'C4Live');
const CHECK = process.argv.includes('--check');
// hashed as text with LF line endings: git may check these files out with CRLF on Windows, the site serves LF
export const stampOf = (file) => crypto.createHash('sha256').update(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).digest('hex').slice(0, 10);
// every local reference with a stamp: name.ext?v=stamp (js, css), as written in app.js strings and index.html attributes
const REF = /((?:\.\.\/)?[A-Za-z0-9_\-./]+\.(?:js|css))\?v=([0-9A-Za-z]*)/g;

export function restamp(file, baseDir) {
  const text = fs.readFileSync(file, 'utf8'), stale = [];
  const out = text.replace(REF, (all, ref, old) => {
    const target = path.resolve(baseDir, ref);
    if (!target.startsWith(ROOT + path.sep) || !fs.existsSync(target)) return all;   // not a file of this site: leave it
    const now = stampOf(target);
    if (now !== old) stale.push(`${path.relative(ROOT, file)}: ${ref} is ${old || '(none)'}, the file is ${now}`);
    return `${ref}?v=${now}`;
  });
  if (!CHECK && out !== text) { fs.writeFileSync(file + '.tmp', out); fs.renameSync(file + '.tmp', file); }
  return stale;
}

const stale = [...restamp(path.join(PAGE, 'app.js'), PAGE), ...restamp(path.join(PAGE, 'index.html'), PAGE)];
if (CHECK) {
  if (stale.length) { console.error('stamps out of date (run node Tools/c4-live/stamp.mjs):\n  ' + stale.join('\n  ')); process.exit(1); }
  console.log('stamps match the files');
} else console.log(stale.length ? 'restamped:\n  ' + stale.join('\n  ') : 'stamps already match the files');
