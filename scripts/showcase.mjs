// Builds docs/showcase/ — the README's picture set.
//
// Two kinds of source: screenshots the player took by hand (dropped in the
// repo root) and shots the harness composed (docs/screens/bw-*.png). Both are
// archived as full-quality PNG under docs/screens/ and published as WebP
// under docs/showcase/, which is what the README links to — a portfolio repo
// should not carry twelve megabytes of PNG in its front page.
//
//   node scripts/showcase.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const screens = path.join(root, 'docs', 'screens');
const showcase = path.join(root, 'docs', 'showcase');

/** [source (repo-relative), published name, archive?] — order is README order. */
const SHOTS = [
  ['Screenshot 2026-08-07 191451.png', 'title-screen', true],
  ['Screenshot 2026-08-07 191528.png', 'the-shore', true],
  ['Screenshot 2026-08-07 192130.png', 'crew-and-voice', true],
  ['docs/screens/bw-drowned.png', 'the-drowned', false],
  ['docs/screens/bw-lamp-man.png', 'the-lamp-man', false],
  ['docs/screens/bw-angler.png', 'the-angler', false],
  ['docs/screens/bw-guardian.png', 'the-guardians', false],
  ['docs/screens/bw-perk.png', 'the-draughts', false],
  ['docs/screens/bw-power.png', 'the-power', false],
  ['docs/screens/bw-wallbuy.png', 'the-free-issue', false],
  ['docs/screens/bw-heart.png', 'the-heart', false],
  ['Screenshot 2026-08-07 193109.png', 'the-ascent', true],
  ['Screenshot 2026-08-07 191754.png', 'the-level-editor', true],
];

fs.mkdirSync(showcase, { recursive: true });

let published = 0;
for (const [src, name, archive] of SHOTS) {
  const from = path.join(root, src);
  if (!fs.existsSync(from)) {
    console.warn(`  skip ${name} — missing ${src}`);
    continue;
  }
  // hand-taken shots get archived under their real name before publishing
  const png = archive ? path.join(screens, `${name}.png`) : from;
  if (archive && !fs.existsSync(png)) fs.copyFileSync(from, png);
  const out = path.join(showcase, `${name}.webp`);
  await sharp(png).webp({ quality: 88 }).toFile(out);
  const kb = (n) => `${Math.round(fs.statSync(n).size / 1024)} kB`;
  console.log(`  ${name.padEnd(18)} ${kb(png).padStart(8)} png → ${kb(out).padStart(8)} webp`);
  published++;
}
console.log(`\ndocs/showcase: ${published} images`);
