import fs from 'node:fs';
import path from 'node:path';
import { cursors, segmentCounts, type Cursor, type CursorType } from '../data/cursors';

/**
 * Build-time extraction of each cursor's CSS from global.css.
 *
 * The stylesheet documents every cursor with a numbered marker comment
 * (`/* 01 Nib — a compact solid dot… *​/`). We slice the file on those markers
 * to recover one block per cursor, then make each block self-contained by
 * prepending the shared plumbing (`.cur` / `.cursor` base + @property decls)
 * and appending any cur-* `@keyframes` it references but doesn't define.
 */

const cssPath = path.join(process.cwd(), 'src/styles/global.css');
const css = fs.readFileSync(cssPath, 'utf8');

// The two colour tokens the cursors paint with, surfaced so the copied snippet
// is genuinely standalone.
const INK_NOTE = `/* Colour tokens — override to re-skin the cursor:
   --ink    underlying text colour (defaults to currentColor)
   --ink-2  primary accent   --ink-3  secondary accent */
:root { --ink: currentColor; --ink-2: #FF4FD8; --ink-3: #4FF8FF; }

`;

// The shared plumbing every cursor needs. Sliced straight out of global.css
// (between the plumbing header and the first numbered marker) so it can never
// drift from what the site actually renders.
const plumbStart = css.indexOf('@property --x');
const plumbEnd = css.indexOf('/* 01 ');
const BASE_CSS = css.slice(plumbStart, plumbEnd).trim();

// The universal pointer tracker. Custom cursors can't follow the mouse with CSS
// alone, so every snippet ships this ~20-line vanilla-JS helper. It writes the
// four custom properties the CSS reads and toggles .is-active / .is-near.
const TRACKER_JS = `// Universal pointer tracker — attach to each .cur box. Writes --x/--y/--angle/
// --speed and toggles .is-active (pointer inside) and .is-near (near centre,
// used by the magnetic cursor). Everything else is pure CSS.
function bindCursor(box) {
  let lx = 0, ly = 0, has = false, idle;
  const set = (p, v) => box.style.setProperty(p, v);
  box.addEventListener('pointermove', (e) => {
    const r = box.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (has) {
      const dx = x - lx, dy = y - ly, d = Math.hypot(dx, dy);
      if (d > 0.5) set('--angle', Math.atan2(dy, dx).toFixed(3) + 'rad');
      set('--speed', Math.min(1, d / 32).toFixed(3));
    }
    set('--x', x.toFixed(1) + 'px');
    set('--y', y.toFixed(1) + 'px');
    box.classList.toggle('is-near', Math.hypot(x - r.width / 2, y - r.height / 2) < 60);
    box.classList.add('is-active');
    lx = x; ly = y; has = true;
    clearTimeout(idle);
    idle = setTimeout(() => set('--speed', '0'), 120); // relax when the pointer stops
  });
  box.addEventListener('pointerleave', () => {
    box.classList.remove('is-active', 'is-near');
    set('--speed', '0');
    has = false;
  });
}
document.querySelectorAll('.cur').forEach(bindCursor);`;

// The gooey metaball cursor needs one SVG filter present in the document.
const GOO_SVG = `<!-- Metaball only: this SVG filter must exist once in the document -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="goo">
    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
    <feColorMatrix in="b" mode="matrix"
      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="g" />
    <feComposite in="SourceGraphic" in2="g" operator="atop" />
  </filter>
</defs></svg>`;

/** Extract every `@keyframes name { … }` block with brace matching. */
function extractKeyframes(src: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /@keyframes\s+([\w-]+)\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length;
    let depth = 1;
    while (i < src.length && depth > 0) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') depth--;
      i++;
    }
    map.set(m[1], src.slice(m.index, i).trim());
  }
  return map;
}

const allKeyframes = extractKeyframes(css);

// Slice the effects section into one block per numbered marker.
const markerRe = /\/\*\s*(\d{2})\s+[^*]*?\*\//g;
const markers = [...css.matchAll(markerRe)];
const sectionEnd = css.indexOf('/* ==== end cursor effects ==== */');

const byIndex = new Map<string, string>();
markers.forEach((marker, i) => {
  const start = marker.index!;
  const end = i + 1 < markers.length ? markers[i + 1].index! : sectionEnd;
  byIndex.set(marker[1], css.slice(start, end).trim());
});

function withKeyframes(block: string): string {
  const definedHere = new Set([...block.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));
  const extras: string[] = [];
  for (const [name, def] of allKeyframes) {
    if (definedHere.has(name)) continue;
    if (new RegExp(`\\b${name}\\b`).test(block)) extras.push(def);
  }
  return extras.length ? `${block}\n\n${extras.join('\n\n')}` : block;
}

/** the per-cursor CSS block, with any referenced keyframes appended */
export const cursorCss: Record<string, string> = {};
for (const cursor of cursors) {
  const block = byIndex.get(cursor.index);
  if (block) cursorCss[cursor.type] = withKeyframes(block);
}

/** the short underlying word shown by the content-aware cursors */
function underlyingWord(type: CursorType): string {
  if (type === 'blend') return 'INVERT';
  if (type === 'spotlight') return 'REVEAL';
  if (type === 'magnet') return 'SNAP';
  return '';
}

/**
 * The full demo markup for a cursor — used by BOTH CursorDemo.astro (rendered
 * with set:html) and the copyable snippet, so they can never diverge.
 */
export function cursorMarkup(cursor: Cursor): string {
  const t = cursor.type;
  const parts: string[] = [
    '<span class="cur-hint mono" aria-hidden="true">hover</span>',
    `<span class="cur-word" aria-hidden="true">${underlyingWord(t)}</span>`,
  ];

  if (t === 'crosshair') parts.push('<i class="cur-h"></i>', '<i class="cur-v"></i>');

  if (t === 'label') {
    parts.push('<span class="cursor flag mono">VIEW ↗</span>');
  } else if (t === 'goo') {
    parts.push('<i class="cursor blob" style="--i:0"></i>', '<i class="cursor blob" style="--i:1"></i>');
  } else if (t === 'eye') {
    parts.push('<i class="cursor"><i class="pupil"></i></i>');
  } else if (t === 'orbit') {
    parts.push('<i class="cursor"><i class="sat"></i></i>');
  } else if (t === 'radar') {
    parts.push('<i class="cursor"><i class="sweep"></i></i>');
  } else {
    const n = segmentCounts[t] ?? 1;
    for (let i = 0; i < n; i++) parts.push(`<i class="cursor" style="--i:${i}"></i>`);
  }

  return `<div class="cur cur-${t}" data-cursor="${t}" role="img" aria-label="${cursor.name} cursor demo">${parts.join('')}</div>`;
}

// Per-cursor copyable snippet: required markup + self-contained CSS + the shared
// JS tracker. Keyed by cursor type (matches each cell's data-cursor).
export const snippets: Record<string, string> = {};
// Per-cursor LLM prompt a coding agent can paste to recreate the cursor exactly.
export const prompts: Record<string, string> = {};

for (const cursor of cursors) {
  const block = cursorCss[cursor.type];
  if (!block) continue;
  const markup = cursorMarkup(cursor);
  const gooNote = cursor.type === 'goo' ? `${GOO_SVG}\n\n` : '';
  const cssOut = `${INK_NOTE}${BASE_CSS}\n\n${block}`;

  snippets[cursor.type] =
    `<!-- Markup -->\n${gooNote}${markup}\n\n` +
    `/* ---- CSS ---- */\n${cssOut}\n\n` +
    `/* ---- JS (custom cursors need a tiny tracker) ---- */\n${TRACKER_JS}`;

  prompts[cursor.type] = `Recreate this custom cursor effect exactly. It needs pure CSS plus a small vanilla-JS pointer tracker — no libraries, no frameworks, no dependencies.

It is the "${cursor.name}" cursor: ${cursor.blurb}. The demo lives inside a \`.cur\` box; the real cursor is hidden and CSS-positioned followers chase the pointer. The motion, timing curves and colours must match the CSS below precisely.

Use this exact HTML markup${cursor.type === 'goo' ? ' (including the one-off SVG goo filter)' : ''}:

${gooNote}${markup}

Apply this CSS:

${cssOut}

Add this JavaScript to drive it:

${TRACKER_JS}

Requirements:
- Keep the markup, class names and custom-property names exactly as shown.
- The cursor paints with the \`--ink-2\` and \`--ink-3\` colour tokens — preserve them so the colours can be overridden.
- Lag, trailing and easing must come from CSS transitions; JS only writes \`--x\`, \`--y\`, \`--angle\` and \`--speed\` and toggles \`.is-active\` / \`.is-near\`.
- Respect \`prefers-reduced-motion: reduce\` by disabling the ambient keyframe animations.
- Do not add any dependencies; plain CSS + the tracker above is all it needs.`;
}
